FROM philm/ansible_playbook

ENV ANSIBLE_PIPELINING True
ENV ANSIBLE_SSH_PIPELINING True
ENV ANSIBLE_ROLES_PATH /ansible/playbooks/_roles

RUN apk update && apk add rsync
RUN pip install 'dopy==0.3.7a'
