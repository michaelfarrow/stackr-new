
resource "digitalocean_domain" "domain" {
  name = "${var.domain}"
  ip_address = "${var.ip}"
}

resource "digitalocean_record" "record" {
  depends_on = ["digitalocean_domain.domain"]
  count = "${length(var.records)}"
  domain = "${var.domain}"
  type = "${lookup(var.records[count.index], "type", "A")}"
  name = "${lookup(var.records[count.index], "name", "@")}"
  value = "${lookup(var.records[count.index], "value", var.ip)}"
  ttl = "${lookup(var.records[count.index], "ttl", 1800)}"
}

resource "digitalocean_record" "record_mx" {
  depends_on = ["digitalocean_domain.domain"]
  count = "${length(var.mx)}"
  domain = "${var.domain}"
  type = "MX"
  name = "${lookup(var.mx[count.index], "name", "@")}"
  value = "${lookup(var.mx[count.index], "value", var.ip)}"
  ttl = "${lookup(var.mx[count.index], "ttl", 1800)}"
  priority = "${lookup(var.mx[count.index], "ttl", 1)}"
}

resource "digitalocean_record" "record_gmail_main" {
  depends_on = ["digitalocean_domain.domain"]
  count = "${var.gmail}"
  domain = "${var.domain}"
  type = "MX"
  name = "@"
  value = "aspmx.l.google.com."
  ttl = 1800
  priority = 1
}

resource "digitalocean_record" "record_gmail_alt_1" {
  depends_on = ["digitalocean_domain.domain"]
  count = "${var.gmail}"
  domain = "${var.domain}"
  type = "MX"
  name = "@"
  value = "alt1.aspmx.l.google.com."
  ttl = 1800
  priority = 5
}

resource "digitalocean_record" "record_gmail_alt_2" {
  depends_on = ["digitalocean_domain.domain"]
  count = "${var.gmail}"
  domain = "${var.domain}"
  type = "MX"
  name = "@"
  value = "alt2.aspmx.l.google.com."
  ttl = 1800
  priority = 5
}

resource "digitalocean_record" "record_gmail_alt_3" {
  depends_on = ["digitalocean_domain.domain"]
  count = "${var.gmail}"
  domain = "${var.domain}"
  type = "MX"
  name = "@"
  value = "alt3.aspmx.l.google.com."
  ttl = 1800
  priority = 10
}

resource "digitalocean_record" "record_gmail_alt_4" {
  depends_on = ["digitalocean_domain.domain"]
  count = "${var.gmail}"
  domain = "${var.domain}"
  type = "MX"
  name = "@"
  value = "alt4.aspmx.l.google.com."
  ttl = 1800
  priority = 10
}
