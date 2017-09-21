
resource "digitalocean_droplet" "node" {
  count = "${var.nodes}"
  name = "docker-swarm-${var.name}-${format("%02d", count.index + 1)}"
  image = "ubuntu-16-04-x64"
  region = "${var.region}"
  size = "${var.size}"
  private_networking = true
  ssh_keys = ["${var.keys}"]

  provisioner "remote-exec" {
    inline = [
      "( wget -O - https://raw.githubusercontent.com/aesopagency/server-tools/master/swap | bash ) > /dev/null",
    ]
    connection {
      private_key = "${file(var.private_key)}"
    }
  }

  provisioner "remote-exec" {
    inline = [
      "docker node demote $(docker info --format '{{.Swarm.NodeID}}') || exit 0",
    ]
    connection {
      private_key = "${file(var.private_key)}"
    }
    when = "destroy"
  }

  provisioner "remote-exec" {
    inline = [
      "docker swarm leave || exit 0",
    ]
    connection {
      private_key = "${file(var.private_key)}"
    }
    when = "destroy"
  }
}

resource "digitalocean_loadbalancer" "loadbalancer" {
  depends_on = ["digitalocean_droplet.node"]
  count = "${(var.loadbalancer && var.nodes > 0) ? 1 : 0}"
  name = "docker-swarm-${var.stack}"
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

  droplet_ids = ["${digitalocean_droplet.node.*.id}"]
}
