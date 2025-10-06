import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Device {
  id: number;
  deviceName: string;
  deviceId: string;
  deviceType: string;
  operatingSystem: string;
  status: string;
  healthStatus: string;
  location: string;
  cloudProvider: string;
  lastSeen: string;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  alertCount: number;
  tags: string[];
  recentAlerts: Alert[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface Alert {
  id: number;
  message: string;
  severity: string;
  timestamp: string;
  deviceId: string;
}

@Component({
  selector: 'app-device-management',
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.css']
})
export class DeviceManagementComponent implements OnInit {
  devices: Device[] = [];
  filteredDevices: Device[] = [];
  selectedDevice: Device | null = null;
  showDeviceModal = false;
  showDetailsModal = false;
  isEditingDevice = false;
  editingDevice: Device | null = null;
  deviceForm: FormGroup;
  
  // Statistics
  onlineDevices = 0;
  offlineDevices = 0;
  criticalDevices = 0;
  totalDevices = 0;
  
  // Filters
  statusFilter = '';
  typeFilter = '';
  searchTerm = '';

  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.deviceForm = this.fb.group({
      deviceName: ['', Validators.required],
      deviceType: ['', Validators.required],
      operatingSystem: [''],
      location: [''],
      cloudProvider: [''],
      tags: [''],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadDevices();
  }

  loadDevices() {
    this.http.get<Device[]>(`${this.apiUrl}/devices`).subscribe({
      next: (devices) => {
        this.devices = devices;
        this.applyFilters();
        this.calculateStatistics();
      },
      error: (error) => {
        console.error('Error loading devices:', error);
        this.loadMockData(); // Fallback to mock data if API fails
      }
    });
  }

  loadMockData() {
    // Mock device data for development
    this.devices = [
      {
        id: 1,
        deviceName: 'Production Server 01',
        deviceId: 'SRV-001',
        deviceType: 'server',
        operatingSystem: 'Ubuntu 22.04 LTS',
        status: 'online',
        healthStatus: 'healthy',
        location: 'Data Center A',
        cloudProvider: 'AWS',
        lastSeen: new Date().toISOString(),
        cpuUsage: 45,
        memoryUsage: 67,
        storageUsage: 23,
        alertCount: 0,
        tags: ['production', 'critical', 'web-server'],
        recentAlerts: [],
        description: 'Main production web server',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 2,
        deviceName: 'Database Server',
        deviceId: 'DB-002',
        deviceType: 'server',
        operatingSystem: 'CentOS 8',
        status: 'online',
        healthStatus: 'warning',
        location: 'Data Center A',
        cloudProvider: 'Azure',
        lastSeen: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        cpuUsage: 78,
        memoryUsage: 89,
        storageUsage: 67,
        alertCount: 2,
        tags: ['production', 'database', 'critical'],
        recentAlerts: [
          {
            id: 1,
            message: 'High memory usage detected',
            severity: 'warning',
            timestamp: new Date(Date.now() - 600000).toISOString(),
            deviceId: 'DB-002'
          },
          {
            id: 2,
            message: 'Storage space running low',
            severity: 'critical',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            deviceId: 'DB-002'
          }
        ],
        description: 'Primary database server',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 3,
        deviceName: 'Development Workstation',
        deviceId: 'WS-003',
        deviceType: 'workstation',
        operatingSystem: 'Windows 11',
        status: 'offline',
        healthStatus: 'unknown',
        location: 'Office Building B',
        cloudProvider: 'On-Premise',
        lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        cpuUsage: 0,
        memoryUsage: 0,
        storageUsage: 0,
        alertCount: 0,
        tags: ['development', 'workstation'],
        recentAlerts: [],
        description: 'Developer workstation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 4,
        deviceName: 'IoT Sensor Hub',
        deviceId: 'IOT-004',
        deviceType: 'iot',
        operatingSystem: 'Raspberry Pi OS',
        status: 'online',
        healthStatus: 'healthy',
        location: 'Warehouse',
        cloudProvider: 'GCP',
        lastSeen: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
        cpuUsage: 12,
        memoryUsage: 34,
        storageUsage: 8,
        alertCount: 0,
        tags: ['iot', 'sensor', 'monitoring'],
        recentAlerts: [],
        description: 'Environmental monitoring sensor hub',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 5,
        deviceName: 'Network Switch',
        deviceId: 'NET-005',
        deviceType: 'network',
        operatingSystem: 'Cisco IOS',
        status: 'online',
        healthStatus: 'healthy',
        location: 'Data Center A',
        cloudProvider: 'On-Premise',
        lastSeen: new Date(Date.now() - 120000).toISOString(), // 2 minutes ago
        cpuUsage: 5,
        memoryUsage: 15,
        storageUsage: 12,
        alertCount: 0,
        tags: ['network', 'infrastructure', 'switch'],
        recentAlerts: [],
        description: 'Core network switch',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    this.applyFilters();
    this.calculateStatistics();
  }

  calculateStatistics() {
    this.totalDevices = this.devices.length;
    this.onlineDevices = this.devices.filter(d => d.status === 'online').length;
    this.offlineDevices = this.devices.filter(d => d.status === 'offline').length;
    this.criticalDevices = this.devices.filter(d => d.healthStatus === 'critical').length;
  }

  applyFilters() {
    this.filteredDevices = this.devices.filter(device => {
      const matchesStatus = !this.statusFilter || device.status === this.statusFilter;
      const matchesType = !this.typeFilter || device.deviceType === this.typeFilter;
      const matchesSearch = !this.searchTerm || 
        device.deviceName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        device.deviceId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        device.location.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesStatus && matchesType && matchesSearch;
    });
  }

  getDeviceCardClass(device: Device): string {
    const baseClass = 'device-card';
    const statusClass = `status-${device.status}`;
    const healthClass = `health-${device.healthStatus}`;
    return `${baseClass} ${statusClass} ${healthClass}`;
  }

  formatLastSeen(lastSeen: string): string {
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  formatAlertTime(timestamp: string): string {
    return this.formatLastSeen(timestamp);
  }

  openAddDeviceModal() {
    this.isEditingDevice = false;
    this.editingDevice = null;
    this.deviceForm.reset();
    this.showDeviceModal = true;
  }

  editDevice(device: Device) {
    this.isEditingDevice = true;
    this.editingDevice = device;
    this.deviceForm.patchValue({
      deviceName: device.deviceName,
      deviceType: device.deviceType,
      operatingSystem: device.operatingSystem,
      location: device.location,
      cloudProvider: device.cloudProvider,
      tags: device.tags.join(', '),
      description: device.description
    });
    this.showDeviceModal = true;
  }

  editSelectedDevice() {
    if (this.selectedDevice) {
      this.closeDetailsModal();
      this.editDevice(this.selectedDevice);
    }
  }

  viewDeviceDetails(device: Device) {
    this.selectedDevice = device;
    this.showDetailsModal = true;
  }

  closeDeviceModal() {
    this.showDeviceModal = false;
    this.isEditingDevice = false;
    this.editingDevice = null;
    this.deviceForm.reset();
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedDevice = null;
  }

  saveDevice() {
    if (this.deviceForm.valid) {
      const formData = this.deviceForm.value;
      const deviceData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [],
        status: 'offline',
        healthStatus: 'unknown',
        lastSeen: new Date().toISOString(),
        cpuUsage: 0,
        memoryUsage: 0,
        storageUsage: 0,
        alertCount: 0,
        recentAlerts: []
      };

      if (this.isEditingDevice && this.editingDevice) {
        // Update existing device
        this.http.put<Device>(`${this.apiUrl}/devices/${this.editingDevice.id}`, deviceData).subscribe({
          next: (updatedDevice) => {
            const index = this.devices.findIndex(d => d.id === updatedDevice.id);
            if (index !== -1) {
              this.devices[index] = updatedDevice;
              this.applyFilters();
              this.calculateStatistics();
            }
            this.closeDeviceModal();
          },
          error: (error) => {
            console.error('Error updating device:', error);
            // For demo purposes, update locally
            const index = this.devices.findIndex(d => d.id === this.editingDevice!.id);
            if (index !== -1) {
              this.devices[index] = { ...this.devices[index], ...deviceData };
              this.applyFilters();
              this.calculateStatistics();
            }
            this.closeDeviceModal();
          }
        });
      } else {
        // Create new device
        this.http.post<Device>(`${this.apiUrl}/devices`, deviceData).subscribe({
          next: (newDevice) => {
            this.devices.push(newDevice);
            this.applyFilters();
            this.calculateStatistics();
            this.closeDeviceModal();
          },
          error: (error) => {
            console.error('Error creating device:', error);
            // For demo purposes, add locally
            const newDevice: Device = {
              id: Math.max(...this.devices.map(d => d.id)) + 1,
              ...deviceData,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            this.devices.push(newDevice);
            this.applyFilters();
            this.calculateStatistics();
            this.closeDeviceModal();
          }
        });
      }
    }
  }

  restartDevice(device: Device) {
    // Simulate device restart
    console.log(`Restarting device: ${device.deviceName}`);
    // In a real implementation, this would call the backend API
    alert(`Restart command sent to ${device.deviceName}`);
  }

  removeDevice(device: Device) {
    if (confirm(`Are you sure you want to remove ${device.deviceName}?`)) {
      this.http.delete(`${this.apiUrl}/devices/${device.id}`).subscribe({
        next: () => {
          this.devices = this.devices.filter(d => d.id !== device.id);
          this.applyFilters();
          this.calculateStatistics();
        },
        error: (error) => {
          console.error('Error removing device:', error);
          // For demo purposes, remove locally
          this.devices = this.devices.filter(d => d.id !== device.id);
          this.applyFilters();
          this.calculateStatistics();
        }
      });
    }
  }

  refreshDevices() {
    this.loadDevices();
  }

  runDeviceScan() {
    // Simulate device scan
    console.log('Running device scan...');
    // In a real implementation, this would call the backend API to scan for new devices
    alert('Device scan initiated. This may take a few minutes to complete.');
  }
}
