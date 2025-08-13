
create-react-app:
	@echo "Creating a new React app..."
	@npm create npm create vite@latest react-project

getOwnership: // Get ownership of the project directory
	@echo "Getting ownership of the project directory..."
	@sudo chown -R $USER /Users/user/Documents/react
# 	@sudo chown -R $(whoami) /Users/user/Documents/react/react-project/node_modules


run-frontend:
	npm run dev

run-backend:
	cd backend && npm run start
