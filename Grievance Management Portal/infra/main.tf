terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region"      { default = "ap-south-1" }
variable "instance_type"   { default = "t3.small" }
variable "key_pair_name"   { description = "Your EC2 key pair name" }
variable "jwt_secret"      { sensitive = true }
variable "mongodb_uri"     { sensitive = true }
variable "ml_service_url"  { default = "http://localhost:8000" }

# ── VPC + Security Group ─────────────────────────────────────────────────────

resource "aws_security_group" "grievance_sg" {
  name        = "grievance-portal-sg"
  description = "Allow HTTP, HTTPS, SSH, and app ports"

  ingress { from_port = 22   to_port = 22   protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  ingress { from_port = 80   to_port = 80   protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  ingress { from_port = 443  to_port = 443  protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  ingress { from_port = 5000 to_port = 5000 protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  ingress { from_port = 8000 to_port = 8000 protocol = "tcp" cidr_blocks = ["0.0.0.0/0"] }
  egress  { from_port = 0    to_port = 0    protocol = "-1"  cidr_blocks = ["0.0.0.0/0"] }

  tags = { Name = "grievance-portal-sg" }
}

# ── EC2 for Spring Boot Backend ───────────────────────────────────────────────

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  filter { name = "name"                values = ["al2023-ami-*-x86_64"] }
  filter { name = "virtualization-type" values = ["hvm"] }
}

resource "aws_instance" "backend" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  key_name               = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.grievance_sg.id]

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y java-17-amazon-corretto docker
    systemctl start docker
    systemctl enable docker

    # Pull and run the backend container
    docker pull ${var.docker_username}/grievance-backend:latest
    docker run -d \
      -p 5000:5000 \
      -e MONGODB_URI="${var.mongodb_uri}" \
      -e JWT_SECRET="${var.jwt_secret}" \
      -e ML_SERVICE_URL="${var.ml_service_url}" \
      -e MAIL_ENABLED=false \
      --restart unless-stopped \
      --name grievance-backend \
      ${var.docker_username}/grievance-backend:latest

    # Pull and run the ML service
    docker pull ${var.docker_username}/grievance-ml:latest
    docker run -d \
      -p 8000:8000 \
      --restart unless-stopped \
      --name grievance-ml \
      ${var.docker_username}/grievance-ml:latest
  EOF

  tags = { Name = "grievance-portal-backend" }
}

variable "docker_username" { description = "Docker Hub username" }

# ── S3 for Image Uploads ──────────────────────────────────────────────────────

resource "aws_s3_bucket" "uploads" {
  bucket = "grievance-portal-uploads-${random_id.suffix.hex}"
  tags   = { Name = "grievance-uploads" }
}

resource "random_id" "suffix" { byte_length = 4 }

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket                  = aws_s3_bucket.uploads.id
  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_cors_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# ── Outputs ───────────────────────────────────────────────────────────────────

output "backend_public_ip"  { value = aws_instance.backend.public_ip }
output "backend_public_dns" { value = aws_instance.backend.public_dns }
output "s3_bucket_name"     { value = aws_s3_bucket.uploads.bucket }
output "s3_bucket_url"      { value = "https://${aws_s3_bucket.uploads.bucket}.s3.${var.aws_region}.amazonaws.com" }
