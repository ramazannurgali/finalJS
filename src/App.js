import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
  Checkbox,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { MoonStars, Sun, Trash } from "tabler-icons-react";

import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);

  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const taskTitle = useRef("");
  const taskSummary = useRef("");

  function createTask() {
    tasks.push({
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      completed: false,
    });
    setTasks([...tasks]);
    saveTasks(tasks);
    setOpened(false);
  }

  function deleteTask(index) {
    const clonedTasks = tasks;
    clonedTasks.splice(index, 1);
    setTasks([...clonedTasks]);
    saveTasks(clonedTasks);
  }

  function toggleComplete(index) {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function loadTasks() {
    let loadedTasks = localStorage.getItem("tasks");
    let tasks = JSON.parse(loadedTasks);
    if (tasks) {
      setTasks(tasks);
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size={"md"}
            title={"New Task"}
            withCloseButton={false}
            onClose={() => setOpened(false)}
            centered
          >
            <TextInput
              mt={"md"}
              ref={taskTitle}
              placeholder={"Task Title"}
              required
              label={"Title"}
            />
            <TextInput
              ref={taskSummary}
              mt={"md"}
              placeholder={"Task Summary"}
              label={"Summary"}
            />
            <Group mt={"md"} position={"apart"}>
              <Button onClick={() => setOpened(false)} variant={"subtle"}>
                Cancel
              </Button>
              <Button onClick={createTask}>Create Task</Button>
            </Group>
          </Modal>
          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                My Tasks
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
            <Title order={4} mt="md">
              Pending Tasks
            </Title>
            {tasks.filter((task) => !task.completed).length > 0 ? (
              tasks
                .filter((task) => !task.completed)
                .map((task, index) => (
                  <Card withBorder key={index} mt={"sm"}>
                    <Group position={"apart"}>
                      <Checkbox
                        checked={task.completed}
                        onChange={() => toggleComplete(index)}
                      />
                      <Text weight={"bold"}>{task.title}</Text>
                      <ActionIcon
                        onClick={() => deleteTask(index)}
                        color={"red"}
                        variant={"transparent"}
                      >
                        <Trash />
                      </ActionIcon>
                    </Group>
                    <Text color={"dimmed"} size={"md"} mt={"sm"}>
                      {task.summary
                        ? task.summary
                        : "No summary was provided for this task"}
                    </Text>
                  </Card>
                ))
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                No pending tasks
              </Text>
            )}
            <Title order={4} mt="md">
              Completed Tasks
            </Title>
            {tasks.filter((task) => task.completed).length > 0 ? (
              tasks
                .filter((task) => task.completed)
                .map((task, index) => (
                  <Card withBorder key={index} mt={"sm"}>
                    <Group position={"apart"}>
                      <Checkbox
                        checked={task.completed}
                        onChange={() => toggleComplete(index)}
                      />
                      <Text weight={"bold"}>{task.title}</Text>
                      <ActionIcon
                        onClick={() => deleteTask(index)}
                        color={"red"}
                        variant={"transparent"}
                      >
                        <Trash />
                      </ActionIcon>
                    </Group>
                    <Text color={"dimmed"} size={"md"} mt={"sm"}>
                      {task.summary
                        ? task.summary
                        : "No summary was provided for this task"}
                    </Text>
                  </Card>
                ))
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                No completed tasks
              </Text>
            )}
            <Button onClick={() => setOpened(true)} fullWidth mt={"md"}>
              New Task
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
