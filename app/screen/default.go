package screen

import (
	"fmt"
	tea "github.com/charmbracelet/bubbletea"
)

type DefaultScreen struct {
	choices  []string
	cursor   int
	selected int
}

func InitialDefaultScreen() DefaultScreen {
	return DefaultScreen{
		choices:  []string{"Add Escrow", "List Escrow", "List Contact"},
		selected: -1,
	}
}

func (m DefaultScreen) Init() tea.Cmd {
	// Just return `nil`, which means "no I/O right now, please."
	return nil
}

func (m DefaultScreen) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "ctrl+c", "q":
			return m, tea.Quit
		case "up", "k":
			if m.cursor > 0 {
				m.cursor--
			}
		case "down", "j":
			if m.cursor < len(m.choices)-1 {
				m.cursor++
			}
		case "enter", " ":
			m.selected = m.cursor
		}
	}
	return m, nil
}

func (m DefaultScreen) title() string {
	s := "🦎 Chameleon Escrow"
	if m.selected >= 0 {
		s = fmt.Sprintf("%s [%s]", s, m.choices[m.selected])
	}
	return fmt.Sprintf("%s\n\n", s)
}

func (m DefaultScreen) menu() string {
	s := ""
	for i, choice := range m.choices {
		cursor := " " // no cursor
		if m.cursor == i {
			cursor = ">" // cursor
		}
		s += fmt.Sprintf("%s %s\n", cursor, choice)
	}
	return s
}

func (m DefaultScreen) View() string {
	header := m.title()
	content := m.menu()
	footer := "Press q to quit"
	return fmt.Sprintf("%s\n%s\n%s\n", header, content, footer)
}
