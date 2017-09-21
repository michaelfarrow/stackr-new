
variable "domain" {}

variable "ip" {}

variable "records" {
  type = "list"
  default = []
}

variable "mx" {
  type = "list"
  default = []
}

variable "gmail" {
  default = false
}
