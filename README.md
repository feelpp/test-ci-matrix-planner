# CI Matrix Planner – E2E Test Repository

This repository provides **end-to-end tests** for the [feelpp/ci-matrix-planner](https://github.com/feelpp/ci-matrix-planner) GitHub Action.  
It validates that the action produces the correct outputs (`mode`, `enabled_jobs`, `targets_json`, etc.) from simple `key=value` directives.

## How it works

- The workflow `.github/workflows/test-planner.yml` runs the planner action with a `message-override` to make tests deterministic.
- The outputs are checked against expected values using `scripts/assert.js`.

## Running

- The workflow runs automatically on **push** and **pull_request**.
- You can trigger it manually from **Actions → Test CI Matrix Planner → Run workflow**.

## Adding a new case

Extend the matrix in the workflow with a new `case`:

```yaml
- name: "my custom case"
  msg: |
    only=feelpp
    targets=fedora:42,ubuntu:24.04
  expect: >
    {"mode":"components",
     "enabled_jobs":["feelpp"],
     "targets":["fedora:42","ubuntu:24.04"]}
```

## Notes

- pr-commit-smoke demonstrates how the planner reads real PR commit messages without message-override.
- Use uses: feelpp/ci-matrix-planner@main (or a tagged release, e.g. @v1.4) to pin a version.
- Debug outputs (RAW, DIRS) are logged to help diagnose parsing issues.