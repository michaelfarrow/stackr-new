FROM williamyeh/ansible:debian9

ENV ANSIBLE_PIPELINING True
ENV ANSIBLE_SSH_PIPELINING True
ENV ANSIBLE_RETRY_FILES_ENABLED False
ENV ANSIBLE_ROLES_PATH /ansible/playbooks/_roles

RUN apt-get update && apt-get install -y python-pip
RUN pip install 'dopy==0.3.7a'
RUN mkdir /ansible
WORKDIR /ansible
