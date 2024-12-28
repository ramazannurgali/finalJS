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
  Select,
  Checkbox,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { MoonStars, Sun, Trash, Edit } from "tabler-icons-react";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [opened, setOpened] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const [sorting, setSorting] = useState(null);
  const [filter, setFilter] = useState(null);

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
  const taskState = useRef("Not done");
  const taskDeadline = useRef("");

  function createTask() {
    const newTask = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState.current.value,
      deadline: taskDeadline.current.value,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    saveTasks([...tasks, newTask]);
    clearInputs();
  }

  function clearInputs() {
    taskTitle.current.value = "";
    taskSummary.current.value = "";
    taskState.current.value = "Not done";
    taskDeadline.current.value = "";
  }

  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  }

  function loadTasks() {
    const loadedTasks = localStorage.getItem("tasks");
    if (loadedTasks) {
      setTasks(JSON.parse(loadedTasks));
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function editTask(index) {
    const task = tasks[index];
    taskTitle.current.value = task.title;
    taskSummary.current.value = task.summary;
    taskState.current.value = task.state;
    taskDeadline.current.value = task.deadline;
    setEditTaskIndex(index);
    setOpened(true);
  }

  function updateTask() {
    const updatedTasks = [...tasks];
    updatedTasks[editTaskIndex] = {
      title: taskTitle.current.value,
      summary: taskSummary.current.value,
      state: taskState.current.value,
      deadline: taskDeadline.current.value,
    };
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setEditTaskIndex(null);
    clearInputs();
    setOpened(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const filteredTasks = filter
    ? tasks.filter((task) => task.state === filter)
    : tasks;

  const sortedTasks =
    sorting === "Deadline"
      ? [...filteredTasks].sort(
          (a, b) => new Date(a.deadline) - new Date(b.deadline)
        )
      : sorting
      ? [...filteredTasks].sort((a, b) =>
          a.state === sorting ? -1 : b.state === sorting ? 1 : 0
        )
      : filteredTasks;

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
            title={editTaskIndex !== null ? "Edit Task" : "New Task"}
            onClose={() => {
              setOpened(false);
              setEditTaskIndex(null);
              clearInputs();
            }}
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
            <Select
              mt={"md"}
              ref={taskState}
              label="State"
              data={["Done", "Not done", "Doing right now"]}
              defaultValue="Not done"
            />
            <TextInput
              mt={"md"}
              ref={taskDeadline}
              placeholder={"Task Deadline"}
              label={"Deadline"}
              type="date"
            />
            <Group mt={"md"} position={"apart"}>
              <Button
                onClick={() => {
                  setOpened(false);
                  setEditTaskIndex(null);
                  clearInputs();
                }}
                variant={"subtle"}
              >
                Cancel
              </Button>
              <Button onClick={editTaskIndex !== null ? updateTask : createTask}>
                {editTaskIndex !== null ? "Update Task" : "Create Task"}
              </Button>
            </Group>
          </Modal>
          <Container size={600} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                Task Manager
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
            <Group mt={"md"} position={"apart"}>
              <Button onClick={() => setSorting("Done")}>Show 'Done' first</Button>
              <Button onClick={() => setSorting("Doing right now")}>
                Show 'Doing' first
              </Button>
              <Button onClick={() => setSorting("Not done")}>
                Show 'Not done' first
              </Button>
              <Button onClick={() => setSorting("Deadline")}>Sort by deadline</Button>
            </Group>
            <Group mt={"md"} position={"apart"}>
              <Button onClick={() => setFilter("Done")}>Show only 'Done'</Button>
              <Button onClick={() => setFilter("Doing right now")}>
                Show only 'Doing'
              </Button>
              <Button onClick={() => setFilter("Not done")}>
                Show only 'Not done'
              </Button>
              <Button onClick={() => setFilter(null)}>Clear Filters</Button>
            </Group>
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task, index) => (
                <Card withBorder key={index} mt={"sm"}>
                  <Group position={"apart"}>
                    <Text weight={"bold"}>{task.title}</Text>
                    <Group>
                      <ActionIcon
                        onClick={() => editTask(index)}
                        color={"blue"}
                        variant={"transparent"}
                      >
                        <Edit />
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => deleteTask(index)}
                        color={"red"}
                        variant={"transparent"}
                      >
                        <Trash />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Text color={"dimmed"} size={"md"} mt={"sm"}>
                    {task.summary || "No summary provided"}
                  </Text>
                  <Text color={"dimmed"} size={"sm"} mt={"sm"}>
                    State: {task.state} | Deadline: {task.deadline || "N/A"}
                  </Text>
                </Card>
              ))
            ) : (
              <Text size={"lg"} mt={"md"} color={"dimmed"}>
                No tasks available
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
