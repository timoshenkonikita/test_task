package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/pla1no/web-server-test/pkg/service"
	"net/http"
)

type Handler struct {
	services *service.Service
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusOK)
			return
		}
		c.Next()
	}
}

func NewHandler(services *service.Service) *Handler {
	return &Handler{
		services: services,
	}
}

func (h *Handler) InitRoutes() *gin.Engine {
	router := gin.New()
	router.Use(CORSMiddleware())

	productRouter := router.Group("/product")
	{
		productRouter.GET("/", h.getAllProducts)
		productRouter.GET("/:id", h.getProductByID)
		productRouter.POST("/", h.createProduct)
		productRouter.PUT("/:id", h.updateProduct)
		productRouter.DELETE("/:id", h.deleteProduct)
	}

	measureRouter := router.Group("/measure")
	{
		measureRouter.GET("/", h.getAllMeasures)
		measureRouter.GET("/:id", h.getMeasureByID)
		measureRouter.POST("/", h.createMeasure)
		measureRouter.PUT("/:id", h.updateMeasure)
		measureRouter.DELETE("/:id", h.deleteMeasure)
	}
	return router
}
