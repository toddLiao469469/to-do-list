import { Todo } from "../utils/types"

// mock data
const getTodoList = (): Promise<Todo[]> => {

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          todoId: "1",
          title: 'First todo',
          description: 'This is the first todo',
          completed: false
        },
        {
          todoId: "2",
          title: 'Second todo',
          description: 'This is the second todo',
          completed: true
        },
        {
          todoId: "3",
          title: 'Third todo',
          description: 'This is the third todo',
          completed: false
        },
        {
          todoId: "4",
          title: 'Fourth todo',
          description: 'This is the fourth todo',
          completed: false
        },
        {
          todoId: "5",
          title: 'Fifth todo',
          description: 'This is the fifth todo',
          completed: true
        }

      ])
    }, 3000)

  })
}


export { getTodoList }