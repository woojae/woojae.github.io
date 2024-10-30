+++
title = 'Use AI to Create a Proxy VM on Google Cloud'
date = 2024-10-30T18:57:37+09:00
draft = false
+++

AI is awesome. I had some terraform code to create a proxy vm on AWS so out of curiosity I asked openAI to do the same thing for Google Cloud. I just pasted the AWS terraform code into the openAI chat interface and it magically gave me fully functional Google terraform code. 

The code wasn’t rocket science and I probably could have done the same thing using my brain in under 20 minutes.  But the AI was able to do it in under 5 seconds. So 240 times faster than a human expert.  Sucks to be human. 

Here's the AI generated code.

```
# Variables
variable "project" {
  description = "The GCP project ID"
  type        = string
  default     = "google-project-id"  # Replace with your actual GCP project ID
}

variable "region" {
  description = "The GCP region to deploy resources in"
  type        = string
  default     = "us-west1"
}

variable "zone" {
  description = "The GCP zone to deploy resources in"
  type        = string
  default     = "us-west1-a"
}

variable "allowed_ip" {
  description = "The IP address that is allowed to access the Squid proxy"
  type        = string
  default     = "4.23.4.2/32"  # Modify this IP to your liking.  Go to http://checkip.amazonaws.com/ and get your public IP address.
}

# Provider Configuration
provider "google" {
  project = var.project
  region  = var.region
  zone    = var.zone
}

# Fetch the default network
data "google_compute_network" "default" {
  name = "default"
}

# Firewall Rule to Allow Inbound Traffic on Port 8080
resource "google_compute_firewall" "squid_proxy_firewall" {
  name    = "squid-proxy-firewall"
  network = data.google_compute_network.default.self_link

  allow {
    protocol = "tcp"
    ports    = ["8080"]
  }

  source_ranges = [var.allowed_ip]

  target_tags = ["squid-proxy"]
}

# Compute Engine Instance
resource "google_compute_instance" "squid_proxy_vm" {
  name         = "squid-proxy-vm"
  machine_type = "e2-micro"
  zone         = var.zone

  boot_disk {
    initialize_params {
      image = "projects/ubuntu-os-cloud/global/images/family/ubuntu-2204-lts"
    }
  }

  network_interface {
    network = data.google_compute_network.default.self_link

    access_config {
      # Ephemeral public IP
    }
  }

  metadata_startup_script = <<-EOF
    #!/bin/bash
    # Update the system
    apt-get update -y

    # Install Squid
    apt-get install squid -y

    # Configure Squid
    cat <<EOT > /etc/squid/squid.conf
    acl allowed_ips src ${var.allowed_ip}
    http_access allow allowed_ips
    http_port 8080
    EOT

    # Restart Squid to apply the new configuration
    systemctl restart squid
  EOF

  tags = ["squid-proxy"]
}

# Output the Public IP Address
output "proxy_vm_public_ip" {
  description = "The public IP address of the Compute Engine instance"
  value       = google_compute_instance.squid_proxy_vm.network_interface[0].access_config[0].nat_ip
}

```