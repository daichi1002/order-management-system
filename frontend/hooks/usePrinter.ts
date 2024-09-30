import { useEffect, useState } from "react";

let savedDevice: BluetoothDevice | null = null;

const useBluetoothPrinter = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectToPrinter = async (): Promise<BluetoothDevice | null> => {
    if (!navigator.bluetooth) {
      setError("このブラウザではBluetoothがサポートされていません。");
      return null;
    }

    try {
      if (savedDevice && savedDevice.gatt?.connected) {
        setIsConnected(true);
        return savedDevice;
      }

      const options: RequestDeviceOptions = {
        filters: [{ name: "JK-5803P" }],
        optionalServices: ["000018f0-0000-1000-8000-00805f9b34fb"],
      };

      const device = await navigator.bluetooth.requestDevice(options);

      if (!device.gatt) {
        throw new Error("Bluetooth GATT not available");
      }

      await device.gatt.connect();
      savedDevice = device;
      setIsConnected(true);
      setError(null);
      return device;
    } catch (error) {
      console.error("Error connecting to printer:", error);
      setError(
        "プリンターとの接続ができていないため、レシートは印字されません。"
      );
      setIsConnected(false);
      return null;
    }
  };

  useEffect(() => {
    const initializeConnection = async () => {
      await connectToPrinter();
    };

    initializeConnection();

    return () => {
      // クリーンアップ関数
      if (savedDevice && savedDevice.gatt?.connected) {
        savedDevice.gatt.disconnect();
      }
    };
  }, []);

  const printReceipt = async (receiptData: string) => {
    try {
      if (!savedDevice || !savedDevice.gatt?.connected) {
        await connectToPrinter();
      }

      if (!savedDevice || !savedDevice.gatt?.connected) {
        throw new Error("Printer not connected");
      }

      const server = await savedDevice.gatt.connect();
      const service = await server.getPrimaryService(
        "000018f0-0000-1000-8000-00805f9b34fb"
      );

      const characteristics = await service.getCharacteristic(
        "00002af1-0000-1000-8000-00805f9b34fb"
      );

      const printCommands = concatUint8Arrays(
        new Uint8Array([ESC, 0x40]), // Initialize printer
        new Uint8Array([ESC, 0x61, 0x01]), // Center alignment
        stringToUint8Array("レシート\n\n"),
        new Uint8Array([ESC, 0x61, 0x00]), // Left alignment
        stringToUint8Array(receiptData + "\n\n"),
        new Uint8Array([GS, 0x56, 0x00]) // Cut paper
      );

      await characteristics.writeValue(printCommands);
      console.log("Receipt printed successfully");
    } catch (error) {
      console.error("Error printing receipt:", error);
      setError("プリンターに接続されていません。");
      setIsConnected(false);
    }
  };

  return { isConnected, error, connectToPrinter, printReceipt };
};

const ESC = 0x1b;
const GS = 0x1d;

function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function concatUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, value) => acc + value.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

export default useBluetoothPrinter;
