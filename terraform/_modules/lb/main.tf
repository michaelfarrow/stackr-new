
resource "digitalocean_loadbalancer" "loadbalancer" {
  count = "${var.present}"
  name = "${var.name}"
  region = "${var.region}"

  forwarding_rule {
    entry_port = 80
    entry_protocol = "http"
    target_port = 80
    target_protocol = "http"
  }

  forwarding_rule {
    entry_port = 8080
    entry_protocol = "http"
    target_port = 8080
    target_protocol = "http"
  }

  healthcheck {
    port = 80
    protocol = "http"
    path = "/"
  }

  droplet_ids = ["${var.droplets}"]
}
