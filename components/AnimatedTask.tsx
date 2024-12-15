import {
    Animated,
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    useAnimatedValue,
    View,
} from "react-native";
import { Task } from "../App";
import { useRef } from "react";

interface AnimatedTaskProps {
    task: Task;
    toggleTaskCompleted: (id: string) => void;
    deleteTask: (id: string) => void;
}

export default function AnimatedTask({
    task,
    toggleTaskCompleted,
    deleteTask,
}: AnimatedTaskProps) {
    const fadeAnim = useAnimatedValue(1);

    const handleDelete = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true, // 애니메이션 성능 최적화를 위해 네이티브 드라이버 사용
        }).start(() => {
            deleteTask(task.id);
        });
    };

    return (
        <Animated.View style={[styles.taskContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
                style={styles.task}
                onPress={() => toggleTaskCompleted(task.id)}
            >
                <Text
                    style={
                        task.completed ? styles.taskCompleted : styles.taskText
                    }
                >
                    {task.text}
                </Text>
            </TouchableOpacity>
            <Button title="Delete" onPress={handleDelete} />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    taskContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        marginVertical: 5,
        backgroundColor: "#fff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    task: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: "#fff",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    taskText: {
        fontSize: 16,
    },
    taskCompleted: {
        fontSize: 16,
        textDecorationLine: "line-through",
        color: "#aaa",
    },
});
