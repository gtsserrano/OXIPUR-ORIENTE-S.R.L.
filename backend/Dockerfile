FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /workspace

COPY pom.xml ./
RUN mvn --batch-mode dependency:go-offline

COPY src ./src
RUN mvn --batch-mode -DskipTests package \
    && cp "$(find target -maxdepth 1 -type f -name '*.jar' ! -name '*.original' -print -quit)" /workspace/app.jar

FROM eclipse-temurin:21-jre-alpine

RUN addgroup -S oxipur \
    && adduser -S -G oxipur -h /app oxipur

WORKDIR /app

COPY --from=build --chown=oxipur:oxipur /workspace/app.jar /app/app.jar

RUN mkdir -p /app/storage \
    && chown -R oxipur:oxipur /app

USER oxipur

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
