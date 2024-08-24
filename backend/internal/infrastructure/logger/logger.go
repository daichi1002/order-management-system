// infrastructure/logger/logger.go

package logger

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var log *zap.Logger

func Init(env string) {
	var config zap.Config
	if env == "production" {
		config = zap.NewProductionConfig()
	} else {
		config = zap.NewDevelopmentConfig()
	}
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	var err error
	log, err = config.Build()
	if err != nil {
		panic(err)
	}
}

// Debug logs a message at DebugLevel.
func Debug(message string, fields ...zap.Field) {
	log.Debug(message, fields...)
}

// Info logs a message at InfoLevel.
func Info(message string, fields ...zap.Field) {
	log.Info(message, fields...)
}

// Warn logs a message at WarnLevel.
func Warn(message string, fields ...zap.Field) {
	log.Warn(message, fields...)
}

// Error logs a message at ErrorLevel.
func Error(message string, fields ...zap.Field) {
	log.Error(message, fields...)
}

// Fatal logs a message at FatalLevel. The logger then calls os.Exit(1), even in production.
func Fatal(message string, fields ...zap.Field) {
	log.Fatal(message, fields...)
}
