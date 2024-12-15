import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import AnimatedTask from "./components/AnimatedTask";

export interface Task {
    id: string;
    text: string;
    completed: boolean;
}

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
        "all"
    );

    const addTask = () => {
        if (inputValue.trim() === "") return;
        setTasks([
            ...tasks,
            {
                id: Date.now().toString(),
                text: inputValue,
                completed: false,
            },
        ]);
        setInputValue("");
    };

    const deleteTask = (id: string) => {
        setTasks((tasks) => tasks.filter((task) => task.id !== id));
    };

    const toggleTaskCompleted = (id: string) => {
        setTasks((tasks) =>
            tasks.map((task) =>
                id === task.id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const saveTasksToStorage = async (tasks: Task[]) => {
        try {
            const jsonValue = JSON.stringify(tasks);
            await AsyncStorage.setItem("tasks", jsonValue);

            console.log("Tasks saved to storage");
        } catch (e) {
            console.error(e);
        }
    };

    const loadTasksFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("tasks");

            if (jsonValue) {
                console.log(
                    "Tasks loaded from storage:",
                    JSON.parse(jsonValue)
                );
                setTasks(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed;
        if (filter === "incomplete") return !task.completed;

        return true;
    });

    useEffect(() => {
        if (tasks.length > 0) {
            saveTasksToStorage(tasks);
        }
    }, [tasks]);

    useEffect(() => {
        loadTasksFromStorage();
    }, []);

    return (
        // View : div와 비슷한 기능
        <View style={styles.container}>
            <View style={styles.header}>
                {/* Text : 텍스트를 표시하기 위한 컴포넌트 */}
                <Text style={styles.headerText}>Todo App</Text>
            </View>

            <View style={styles.filterContainer}>
                <TouchableOpacity
                    onPress={() => setFilter("all")}
                    style={[
                        styles.filterButton,
                        filter === "all" && styles.activeFilterButton,
                    ]}
                >
                    <Text>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setFilter("completed")}
                    style={[
                        styles.filterButton,
                        filter === "completed" && styles.activeFilterButton,
                    ]}
                >
                    <Text>Completed</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setFilter("incomplete")}
                    style={[
                        styles.filterButton,
                        filter === "incomplete" && styles.activeFilterButton,
                    ]}
                >
                    <Text>Incomplete</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                {/* TextInput : 텍스트 입력창을 표시하기 위한 컴포넌트 */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter a task"
                    value={inputValue}
                    onChangeText={setInputValue}
                ></TextInput>
                <Button title="Add!" onPress={addTask} />
            </View>

            {/* FlatList : 데이터를 배열의 형태로 보여주는 컴포넌트 */}
            <FlatList
                data={filteredTasks}
                // 각 아이템의 고유 키 설정
                keyExtractor={(item) => item.id}
                // 각 항목을 렌더링하는 부분
                renderItem={({ item: task }) => (
                    // 터치 가능한 영역을 만들어주는 컴포넌트
                    <AnimatedTask
                        task={task}
                        toggleTaskCompleted={toggleTaskCompleted}
                        deleteTask={deleteTask}
                    />
                )}
            />

            <View style={styles.footer}>
                <Text>{tasks.length} task remaining</Text>
            </View>
        </View>
    );
}

// StyleSheet : 스타일을 정의하기 위한 react native의 객체
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "f8f9fa",
    },
    header: {
        padding: 15,
        alignItems: "center",
        backgroundColor: "#6200ee",
        borderRadius: 5,
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 15,
    },
    filterButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    activeFilterButton: {
        backgroundColor: "#6200ee",
        color: "#fff",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 15,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "gray",
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    footer: {
        marginTop: 10,
        alignItems: "center",
    },
});
