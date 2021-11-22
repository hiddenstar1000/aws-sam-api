.PHONY: build-RuntimeDependenciesLayer build-lambda-common
.PHONY: build-WelcomeFunction build-CreateUserFunction build-GetUserFunction build-GetUsersFunction build-UpdateUserFunction build-DeleteUserFunction

build-WelcomeFunction:
	$(MAKE) HANDLER=src/welcome/app.ts build-lambda-common
build-CreateUserFunction:
	$(MAKE) HANDLER=src/user/create-user.ts build-lambda-common
build-GetUserFunction:
	$(MAKE) HANDLER=src/user/get-user.ts build-lambda-common
build-GetUsersFunction:
	$(MAKE) HANDLER=src/user/get-users.ts build-lambda-common
build-UpdateUserFunction:
	$(MAKE) HANDLER=src/user/update-user.ts build-lambda-common
build-DeleteUserFunction:
	$(MAKE) HANDLER=src/user/delete-user.ts build-lambda-common

build-lambda-common:
	npm install
	rm -rf dist
	echo "{\"extends\": \"./tsconfig.json\", \"include\": [\"${HANDLER}\"] }" > tsconfig-only-handler.json
	npm run build -- --build tsconfig-only-handler.json
	cp -r dist "$(ARTIFACTS_DIR)/"

build-RuntimeDependenciesLayer:
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
	cp package.json package-lock.json "$(ARTIFACTS_DIR)/nodejs/"
	npm install --production --prefix "$(ARTIFACTS_DIR)/nodejs/"
	rm "$(ARTIFACTS_DIR)/nodejs/package.json" # to avoid rebuilding when changes doesn't relate to dependencies