package main

import (
	"context"
	"fmt"
	"github.com/xssnick/tonutils-go/address"
	"github.com/xssnick/tonutils-go/liteclient"
	"github.com/xssnick/tonutils-go/ton"
	"log"
	"os"
)

const networkDefault = "https://ton-blockchain.github.io/testnet-global.config.json"

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if len(value) == 0 {
		return fallback
	}
	return value
}

func main() {
	client := liteclient.NewConnectionPool()
	err := client.AddConnectionsFromConfigUrl(context.Background(), getEnv("NETWORK", networkDefault))
	if err != nil {
		panic(err)
	}
	api := ton.NewAPIClient(client)
	ctx := client.StickyContext(context.Background())

	block, err := api.CurrentMasterchainInfo(ctx)
	if err != nil {
		log.Fatalln("get block err:", err.Error())
		return
	}
	addr := address.MustParseAddr("kQBA4JK6ur2Qdoco6tbEIT8G_Iokush9pEDsvuVzjY0l9ILe")
	res, err := api.RunGetMethod(ctx, block, addr, "get_counter")
	if err != nil {
		log.Fatalln("run get method get_counter err:", err.Error())
		return
	}
	counter := res.MustInt(0)
	fmt.Printf("counter = %d\n", counter)
	res, err = api.RunGetMethod(ctx, block, addr, "get_id")
	if err != nil {
		log.Fatalln("run get method get_id err:", err.Error())
		return
	}
	id := res.MustInt(0)
	fmt.Printf("id = %d\n", id)
}
