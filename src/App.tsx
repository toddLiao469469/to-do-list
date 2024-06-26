import PageLayout from "@/components/common/PageLayout";
import Toast from "@/components/Toast";
import TodoListPage from "@/pages/Todo";

function App() {
  return (
    <PageLayout>
      <TodoListPage />
      <Toast />
    </PageLayout>
  );
}

export default App;
