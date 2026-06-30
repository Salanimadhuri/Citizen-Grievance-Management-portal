# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copy pom.xml first — lets Docker cache the dependency layer.
# Dependencies are only re-downloaded when pom.xml changes.
COPY pom.xml .
RUN mvn dependency:go-offline -B --no-transfer-progress

# Copy source and build
COPY src ./src
RUN mvn clean package -DskipTests --no-transfer-progress

# ─────────────────────────────────────────────
# Stage 2: Runtime (slim JRE image)
# ─────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Non-root user for security best practice
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser:appgroup

# Copy built JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Create uploads directory (complaint images)
RUN mkdir -p uploads

EXPOSE 5000

# JVM tuning for containers:
#   -Xms256m          — initial heap
#   -Xmx512m          — max heap (adjust for your instance)
#   -XX:+UseG1GC      — G1 GC suitable for container environments
#   -Djava.security.egd — faster startup entropy source
ENTRYPOINT ["java", \
  "-Xms256m", \
  "-Xmx512m", \
  "-XX:+UseG1GC", \
  "-XX:MaxGCPauseMillis=200", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
