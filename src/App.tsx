import { useEffect, useMemo, useState } from "react";
import { AddDeviceModal } from "./components/AddDeviceModal";
import { Dashboard } from "./components/Dashboard";
import { DeviceProfiles } from "./components/DeviceProfiles";
import { HomeHero } from "./components/HomeHero";
import { Nav } from "./components/Nav";
import { SmartAcousticAnalysis } from "./components/SmartAcousticAnalysis";
import {
  createDevice,
  deleteDevice,
  getDevices,
  updateDevice,
} from "./services/deviceService";
import type { Device } from "./types/device";
import { filterDevices, type DeviceFilter } from "./utils/deviceStatus";

export default function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<DeviceFilter>("all");
  const [isDeviceLoading, setIsDeviceLoading] = useState(true);
  const [deviceError, setDeviceError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getDevices()
      .then((remoteDevices) => {
        if (isMounted) {
          setDevices(remoteDevices);
          setDeviceError(null);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setDeviceError(getErrorMessage(error));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsDeviceLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectedDevice = devices.find((device) => device.id === selectedDeviceId);

  const visibleDevices = useMemo(
    () => filterDevices(devices, searchTerm, activeFilter),
    [activeFilter, devices, searchTerm],
  );

  const handleAddDevice = () => {
    setEditingDevice(null);
    setIsModalOpen(true);
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
    setIsModalOpen(true);
  };

  const handleSaveDevice = async (savedDevice: Device) => {
    const editingId = editingDevice?.id;
    const exists = devices.some((device) => device.id === editingId);

    try {
      const syncedDevice =
        exists && editingId
          ? await updateDevice(editingId, savedDevice)
          : await createDevice(savedDevice);

      setDevices((currentDevices) => {
        if (exists) {
          return currentDevices.map((device) =>
            device.id === editingId ? syncedDevice : device,
          );
        }

        return [syncedDevice, ...currentDevices];
      });

      if (selectedDeviceId === editingId) {
        setSelectedDeviceId(syncedDevice.id);
      }
      setDeviceError(null);
    } catch (error) {
      setDeviceError(getErrorMessage(error));
      return;
    }

    setIsModalOpen(false);
    setEditingDevice(null);
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      await deleteDevice(deviceId);
    } catch (error) {
      setDeviceError(getErrorMessage(error));
      return;
    }

    setDevices((currentDevices) =>
      currentDevices.filter((device) => device.id !== deviceId),
    );

    if (selectedDeviceId === deviceId) {
      setSelectedDeviceId(null);
    }

    setIsModalOpen(false);
    setEditingDevice(null);
    setDeviceError(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDevice(null);
  };

  if (selectedDevice) {
    return (
      <>
        <Dashboard device={selectedDevice} onBack={() => setSelectedDeviceId(null)} />
        <AddDeviceModal
          isOpen={isModalOpen}
          editingDevice={editingDevice}
          onClose={closeModal}
          onDelete={handleDeleteDevice}
          onSave={handleSaveDevice}
        />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-cream text-stone-900">
      <Nav />
      <HomeHero />
      <SmartAcousticAnalysis />
      <DeviceProfiles
        devices={visibleDevices}
        searchTerm={searchTerm}
        activeFilter={activeFilter}
        isLoading={isDeviceLoading}
        errorMessage={deviceError}
        onSearchChange={setSearchTerm}
        onFilterChange={setActiveFilter}
        onAddDevice={handleAddDevice}
        onViewDashboard={(device) => setSelectedDeviceId(device.id)}
        onEditDevice={handleEditDevice}
      />
      <AddDeviceModal
        isOpen={isModalOpen}
        editingDevice={editingDevice}
        onClose={closeModal}
        onDelete={handleDeleteDevice}
        onSave={handleSaveDevice}
      />
    </main>
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to connect to Supabase.";
}
