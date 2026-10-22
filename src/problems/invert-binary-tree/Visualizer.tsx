import { TreeLessonPlayer } from '../tree-lessons/TreeLessonPlayer'
import { invertLesson } from './lesson'

export function InvertBinaryTreeVisualizer() {
  return <TreeLessonPlayer lesson={invertLesson} />
}
