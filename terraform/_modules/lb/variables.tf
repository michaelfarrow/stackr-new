
variable "present" {
  default = true
}

variable "name" {}

variable "region" {
  default = "lon1"
}

variable "droplets" {
  default = []
  type = "list"
}
