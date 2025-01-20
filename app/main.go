package main

import (
	"fmt"
	"os"

	tea "github.com/charmbracelet/bubbletea"
	"github.com/ilyar/chameleon-escrow/app/screen"
)

func main() {
	p := tea.NewProgram(screen.InitialDefaultScreen())
	if _, err := p.Run(); err != nil {
		fmt.Printf("Error: %v", err)
		os.Exit(1)
	}
}
