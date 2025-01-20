package screen

import (
	"fmt"
	tea "github.com/charmbracelet/bubbletea"
)

type AddScreen struct {
	choices  []string
	cursor   int
	selected map[int]struct{}
}

func InitialAddScreen() AddScreen {
	return AddScreen{
		choices:  []string{"Add Escrow", "List Escrow", "List Contact"},
		selected: make(map[int]struct{}),
	}
}

func (m AddScreen) Init() tea.Cmd {
	// Just return `nil`, which means "no I/O right now, please."
	return nil
}

func (m AddScreen) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
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
			_, ok := m.selected[m.cursor]
			if ok {
				delete(m.selected, m.cursor)
			} else {
				m.selected[m.cursor] = struct{}{}
			}
		}
	}
	return m, nil
}

func (m AddScreen) View() string {
	s := "Chameleon Escrow\n\n"
	for i, choice := range m.choices {
		cursor := " " // no cursor
		if m.cursor == i {
			cursor = ">" // cursor
		}
		s += fmt.Sprintf("%s %s\n", cursor, choice)
	}
	s += "\nPress q to quit.\n"
	return s
}
