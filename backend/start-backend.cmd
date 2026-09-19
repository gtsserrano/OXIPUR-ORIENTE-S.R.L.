@echo off
rem Inicia el backend con JDK 25 (requerido por pom.xml), sin importar el JAVA_HOME global.
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-25.0.2.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0"
call mvnw.cmd spring-boot:run
