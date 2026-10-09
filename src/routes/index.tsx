import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "오늘의 할 일" },
      { name: "description", content: "간단하고 깔끔한 할 일 목록 앱" },
      { property: "og:title", content: "오늘의 할 일" },
      { property: "og:description", content: "간단하고 깔끔한 할 일 목록 앱" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "todos-v1";

function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
}

function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTodos(loadTodos());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, hydrated]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, done: false },
      ...prev,
    ]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="flex min-h-screen justify-center bg-background px-4 py-16">
      <main className="w-full max-w-md">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            오늘의 할 일
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {todos.length === 0
              ? "새로운 할 일을 추가해보세요"
              : remaining === 0
                ? "모든 할 일을 완료했어요 🎉"
                : `${remaining}개의 할 일이 남았어요`}
          </p>
        </header>

        <form
          className="mb-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="할 일을 입력하세요"
            className="flex-1 rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="submit"
            aria-label="추가"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <Plus className="size-5" />
          </button>
        </form>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-colors"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.done ? "완료 취소" : "완료"}
                className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  todo.done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40 text-transparent hover:border-primary"
                }`}
              >
                <Check className="size-4" />
              </button>
              <span
                className={`flex-1 text-sm ${
                  todo.done
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                aria-label="삭제"
                className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <div className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            아직 할 일이 없어요
          </div>
        )}
      </main>
    </div>
  );
}
