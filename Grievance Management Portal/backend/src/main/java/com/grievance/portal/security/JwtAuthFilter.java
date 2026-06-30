package com.grievance.portal.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JwtAuthFilter — per-request JWT authentication filter.
 *
 * This is the direct Spring Boot equivalent of Express authMiddleware.js:
 *
 *   // Express authMiddleware.js
 *   const token = req.headers.authorization?.split(' ')[1];
 *   const decoded = jwt.verify(token, JWT_SECRET);
 *   req.user = await User.findById(decoded.id);
 *   next();
 *
 * Spring Security equivalent:
 *   - Extract token from Authorization header
 *   - Validate via JwtUtil
 *   - Load user via UserDetailsServiceImpl
 *   - Set Authentication in SecurityContext (= req.user equivalent)
 *   - Continue filter chain (= next())
 *
 * Extends OncePerRequestFilter — runs exactly once per HTTP request.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // ─── Step 1: Extract token from Authorization header ──────────
        //
        // Express: req.headers.authorization?.split(' ')[1]
        // Expected format: "Bearer <token>"

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // No token — continue as unauthenticated request.
            // SecurityConfig will reject if the endpoint requires auth.
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(7); // Remove "Bearer " prefix

        // ─── Step 2: Validate token ───────────────────────────────────
        //
        // Express: jwt.verify(token, JWT_SECRET) — throws on failure
        // Spring: jwtUtil.validateToken(token) — returns boolean

        if (!jwtUtil.validateToken(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ─── Step 3: Extract userId from token ────────────────────────
        //
        // Express: decoded.id (from jwt.verify payload)
        // Spring: jwtUtil.extractUserId(token) reads 'sub' claim

        final String userId = jwtUtil.extractUserId(token);

        // ─── Step 4: Skip if already authenticated ────────────────────
        if (userId == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        // ─── Step 5: Load user from database ─────────────────────────
        //
        // Express: req.user = await User.findById(decoded.id);
        // Spring: userDetailsService.loadUserByUsername(userId)

        try {
            UserDetails userDetails = userDetailsService.loadUserByUsername(userId);

            // ─── Step 6: Create authentication token ─────────────────
            //
            // This is what gets injected as @AuthenticationPrincipal
            // in controller methods — equivalent to req.user in Express.

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,                           // credentials (not needed after auth)
                            userDetails.getAuthorities()    // roles: [ROLE_CITIZEN / ROLE_OFFICER / ROLE_ADMIN]
                    );

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // ─── Step 7: Store in SecurityContext ─────────────────────
            //
            // This is Spring's equivalent of: req.user = user
            // Available throughout the request via SecurityContextHolder

            SecurityContextHolder.getContext().setAuthentication(authToken);

        } catch (Exception e) {
            // User deleted after token was issued, or DB error
            log.warn("Could not authenticate user {}: {}", userId, e.getMessage());
            // Don't set authentication — request proceeds as unauthenticated
        }

        // ─── Step 8: Continue request processing ─────────────────────
        //
        // Express: next()
        filterChain.doFilter(request, response);
    }
}
