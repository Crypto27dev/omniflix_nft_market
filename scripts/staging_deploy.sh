#!/bin/bash

ssh-keyscan gitlab.ctlabs.in >>"${HOME}"/.ssh/known_hosts &&
  known_hosts=$(sort <"${HOME}"/.ssh/known_hosts | uniq) &&
  echo "${known_hosts}" >"${HOME}"/.ssh/known_hosts

PROJECT_DIR=${HOME}/omniflix/nucleus/front_end
if [[ ! -d ${PROJECT_DIR} ]]; then
  cd "${HOME}" &&
    git clone git@gitlab.ctlabs.in:omniflix/nucleus/front_end.git
fi

cd "${PROJECT_DIR}" &&
  git stash &&
  git checkout staging &&
  git pull origin staging &&
  yarn &&
  yarn build
