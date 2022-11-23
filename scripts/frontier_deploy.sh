#!/bin/bash

ssh-keyscan gitlab.ctlabs.in >>"${HOME}"/.ssh/known_hosts &&
  known_hosts=$(sort <"${HOME}"/.ssh/known_hosts | uniq) &&
  echo "${known_hosts}" >"${HOME}"/.ssh/known_hosts

PROJECT_DIR=${HOME}/omniflix/nucleus-frontier/front_end
if [[ ! -d ${PROJECT_DIR} ]]; then
  cd "${HOME}" &&
    git clone git@gitlab.ctlabs.in:omniflix/nucleus-frontier/front_end.git
fi

cd "${PROJECT_DIR}" &&
  git stash &&
  git checkout frontier &&
  git pull origin frontier &&
  yarn &&
  yarn build &&
  mkdir -p /var/www/html/ &&
  sudo rm -rf /var/www/html/frontier.omniflix.market/ &&
  sudo cp -r "${PROJECT_DIR}"/build/ /var/www/html/frontier.omniflix.market/

