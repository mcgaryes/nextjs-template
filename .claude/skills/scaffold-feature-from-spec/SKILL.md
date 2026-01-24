You are executing the meta-skill: scaffold-feature-from-spec.

Input: {featureName}, {requirements}

Goal: Generate a complete feature scaffold by orchestrating existing skills.

Procedure (must follow exactly):
1) Parse requirements into a plan with:
    - folders/files to create
    - types/interfaces to define
    - context state shape + API
    - hook API
    - list of components + props
    - root wiring needs
2) Invoke skill scaffold-feature with:
    - featureName
    - folders: components, hooks, context, model
    - create barrel export index.ts
3) Create model/types.ts with:
    - union types and interfaces required by spec
4) Invoke skill scaffold-context:
    - name: AlertContext (or derived from featureName)
    - provider: AlertProvider
    - implement grouped state and CRUD methods
5) Invoke skill scaffold-hook:
    - name: useAlert
    - surface: add/remove/update
6) Invoke scaffold-component for each component in plan:
    - AlertView
    - AlertsView
7) Wire feature into app root so it persists through navigation:
    - detect root entry file and modify it
8) Finalize:
    - ensure exports in features/{feature}/index.ts
    - print list of created/modified files
    - include a minimal usage snippet

Constraints:
- Follow repository conventions.
- Do not ask questions unless blocked.
- Produce compiling TypeScript/React code.