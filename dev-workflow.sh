#!/bin/bash
# NeuroBreath Development Workflow Helper

show_help() {
    echo "🚀 NeuroBreath Development Workflow"
    echo "===================================="
    echo ""
    echo "Usage: ./dev-workflow.sh [command]"
    echo ""
    echo "Commands:"
    echo "  feature    - Create a new feature branch"
    echo "  commit     - Stage and commit changes"
    echo "  push       - Push current branch to GitHub"
    echo "  status     - Show repository status"
    echo "  sync       - Sync with main branch"
    echo "  help       - Show this help message"
    echo ""
}

create_feature() {
    echo "Enter feature name (e.g., 'new-breathing-technique'):"
    read -r feature_name
    
    if [ -z "$feature_name" ]; then
        echo "❌ Feature name cannot be empty"
        return 1
    fi
    
    branch_name="feat/$feature_name"
    echo "Creating branch: $branch_name"
    git checkout -b "$branch_name"
    echo "✅ Branch created. Start developing!"
}

commit_changes() {
    echo "📦 Staging all changes..."
    git add .
    
    echo ""
    echo "Files to commit:"
    git status --short
    
    echo ""
    echo "Enter commit message:"
    read -r commit_msg
    
    if [ -z "$commit_msg" ]; then
        echo "❌ Commit message cannot be empty"
        return 1
    fi
    
    git commit -m "$commit_msg"
    echo "✅ Changes committed"
}

push_branch() {
    current_branch=$(git branch --show-current)
    echo "Pushing branch: $current_branch"
    git push -u origin "$current_branch"
    echo "✅ Pushed to GitHub"
}

show_status() {
    echo "📊 Repository Status"
    echo "==================="
    echo ""
    echo "Current branch: $(git branch --show-current)"
    echo ""
    git status
    echo ""
    echo "Recent commits:"
    git log --oneline -n 5
}

sync_main() {
    echo "🔄 Syncing with main branch..."
    git fetch origin
    git checkout main
    git pull origin main
    echo "✅ Synced with main"
}

case "$1" in
    feature)
        create_feature
        ;;
    commit)
        commit_changes
        ;;
    push)
        push_branch
        ;;
    status)
        show_status
        ;;
    sync)
        sync_main
        ;;
    help|*)
        show_help
        ;;
esac
