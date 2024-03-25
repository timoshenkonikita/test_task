package main

import (
	"log"

	_ "github.com/lib/pq"
	"github.com/pla1no/web-server-test/api"
	"github.com/pla1no/web-server-test/pkg/handler"
	"github.com/pla1no/web-server-test/pkg/repository"
	"github.com/pla1no/web-server-test/pkg/service"
	"github.com/spf13/viper"
)

func main() {
	if err := InitConfig(); err != nil {
		log.Fatalf("error initializing config %s", err.Error())
	}

	db, err := repository.NewPostgresDB(repository.Config{
		Host:     viper.GetString("db.host"),
		Port:     viper.GetString("db.port"),
		Username: viper.GetString("db.username"),
		Password: viper.GetString("db.password"),
		DBName:   viper.GetString("db.dbname"),
		SSLMode:  viper.GetString("db.sslmode"),
	})
	if err != nil {
		log.Fatalf("error connecting to database %s", err.Error())
	}

	repos := repository.NewRepository(db)
	services := service.NewService(repos)
	handlers := handler.NewHandler(services)

	srv := new(api.Server)
	if err := srv.Run("8080", handlers.InitRoutes()); err != nil {
		log.Fatalf("error occurred while running server: %s", err.Error())
	}

}

func InitConfig() error {
	viper.AddConfigPath("configs")
	viper.SetConfigName("config")
	return viper.ReadInConfig()
}
