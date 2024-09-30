package printer

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/go-ble/ble"
	"github.com/go-ble/ble/examples/lib/dev"
)

const (
	thermalPrinterName = "JK-5803P"
	maxRetries         = 3
	retryDelay         = 5 * time.Second
	writeCharUUID      = "ff02" // データ書き込み用の特性UUID
)

type Printer struct {
	device ble.Device
}

func NewPrinter() Printer {
	d, err := dev.NewDevice("default")
	if err != nil {
		log.Fatal("failed to create new device: ", err)
	}
	ble.SetDefaultDevice(d)
	return Printer{device: d}
}

// プリントするための接続ロジック
func (p *Printer) Print(ctx context.Context, data string) error {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	// スキャンのコールバック
	scanHandler := func(a ble.Advertisement) {
		if a.LocalName() == thermalPrinterName {
			log.Printf("Found printer: %s", a.Addr())
			cancel() // スキャンを停止
			err := p.connectAndOperate(a.Addr(), data)
			if err != nil {
				log.Printf("Operation failed: %s", err)
			}
		}
	}

	// スキャン開始
	err := ble.Scan(ctx, true, scanHandler, nil)
	if err != nil && err != context.Canceled {
		return fmt.Errorf("scan failed: %w", err)
	}

	return nil
}

// プリンターに接続してデータを送信
func (p *Printer) connectAndOperate(addr ble.Addr, data string) error {
	for retry := 0; retry < maxRetries; retry++ {
		if retry > 0 {
			log.Printf("Retrying connection in %v...", retryDelay)
			time.Sleep(retryDelay)
		}

		err := p.connect(addr, data)
		if err == nil {
			return nil
		}
		log.Printf("Connection attempt %d failed: %s", retry+1, err)
	}
	return fmt.Errorf("failed to connect after %d attempts", maxRetries)
}

func (p *Printer) connect(addr ble.Addr, data string) error {
	log.Printf("Connecting to %s...", addr)

	ctx := ble.WithSigHandler(context.WithTimeout(context.Background(), 30*time.Second))
	client, err := ble.Dial(ctx, addr)
	if err != nil {
		return fmt.Errorf("failed to connect: %w", err)
	}
	defer client.CancelConnection()

	log.Printf("Connected to %s", addr)

	// サービスの探索
	services, err := client.DiscoverServices(nil)
	if err != nil {
		return fmt.Errorf("failed to discover services: %w", err)
	}

	var writeChar *ble.Characteristic
	for _, service := range services {
		chars, err := client.DiscoverCharacteristics(nil, service)
		if err != nil {
			continue
		}

		for _, char := range chars {
			if char.UUID.String() == writeCharUUID {
				writeChar = char
			}
		}
	}

	if writeChar == nil {
		return fmt.Errorf("write characteristic not found")
	}

	err = p.sendPrintData(client, writeChar, data)
	if err != nil {
		return fmt.Errorf("failed to send print data: %w", err)
	}

	return nil
}

func (p *Printer) sendPrintData(client ble.Client, char *ble.Characteristic, data string) error {
	err := client.WriteCharacteristic(char, []byte(data), false)
	if err != nil {
		return fmt.Errorf("failed to write to characteristic: %w", err)
	}
	log.Printf("Data sent to printer successfully")
	return nil
}
