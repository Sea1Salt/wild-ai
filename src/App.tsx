import { useMemo, useState } from "react";
import { AddDeviceModal } from "./components/AddDeviceModal";
import { Dashboard } from "./components/Dashboard";
import { DeviceProfiles } from "./components/DeviceProfiles";
import { HomeHero } from "./components/HomeHero";
import { Nav } from "./components/Nav";
import { SmartAcousticAnalysis } from "./components/SmartAcousticAnalysis";
import { mockDevices } from "./data/mockDevices";
import type { Device } from "./types/device";
import { filterDevices, type DeviceFilter } from "./utils/deviceStatus";

export default function App() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<DeviceFilter>("all");

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

  const handleSaveDevice = (savedDevice: Device) => {
    setDevices((currentDevices) => {
      const editingId = editingDevice?.id;
      const exists = currentDevices.some((device) => device.id === editingId);

      if (exists) {
        return currentDevices.map((device) =>
          device.id === editingId ? savedDevice : device,
        );
      }

      return [savedDevice, ...currentDevices];
    });

    if (selectedDeviceId === editingDevice?.id) {
      setSelectedDeviceId(savedDevice.id);
    }

    setIsModalOpen(false);
    setEditingDevice(null);
  };

  const handleDeleteDevice = (deviceId: string) => {
    setDevices((currentDevices) =>
      currentDevices.filter((device) => device.id !== deviceId),
    );

    if (selectedDeviceId === deviceId) {
      setSelectedDeviceId(null);
    }

    setIsModalOpen(false);
    setEditingDevice(null);
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
