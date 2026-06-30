package com.grievance.portal.security;

import com.grievance.portal.model.User;
import com.grievance.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * UserDetailsServiceImpl — loads user by ID for Spring Security.
 *
 * In Spring Security, "username" = the principal identifier.
 * We use the MongoDB user ID (not email) as the principal,
 * because JwtUtil stores userId in the token's 'sub' claim.
 *
 * This is the Spring equivalent of:
 *   const user = await User.findById(decoded.id);
 *   req.user = user;
 *
 * The loaded UserDetails is then available via @AuthenticationPrincipal
 * in every controller method.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Load UserDetails by userId (MongoDB _id).
     *
     * Called by JwtAuthFilter after extracting userId from the JWT.
     * The returned UserDetails is stored in SecurityContext for the request.
     *
     * @param userId MongoDB document _id string
     * @return Spring Security UserDetails
     * @throws UsernameNotFoundException if user not found (returns 403 to client)
     */
    @Override
    public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.warn("User not found for id: {}", userId);
                    return new UsernameNotFoundException("User not found: " + userId);
                });

        /*
         * Map role to Spring Security GrantedAuthority.
         * Express role:  "citizen"  →  Spring authority: "ROLE_CITIZEN"
         * Express role:  "officer"  →  Spring authority: "ROLE_OFFICER"
         * Express role:  "admin"    →  Spring authority: "ROLE_ADMIN"
         *
         * @PreAuthorize("hasRole('CITIZEN')") checks for "ROLE_CITIZEN" internally.
         */
        String authority = "ROLE_" + user.getRole().toUpperCase();

        return new org.springframework.security.core.userdetails.User(
                user.getId(),           // principal = userId (NOT email)
                user.getPassword() != null ? user.getPassword() : "",
                List.of(new SimpleGrantedAuthority(authority))
        );
    }
}
