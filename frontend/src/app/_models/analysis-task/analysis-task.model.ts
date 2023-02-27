import { AnalysisTaskStatus } from "src/app/_helpers/enums/analysis-task-status";
import { Deserializable } from "../deserializable.model";

export class AnalysisTask implements Deserializable {
  taskId: String;
  taskStatus: AnalysisTaskStatus;
  taskResult: any;

  constructor() {
    this.taskId = '';
    this.taskStatus = AnalysisTaskStatus.Pending;
    this.taskResult = null;
  }

  deserialize(input: any): this {
    this.taskId = input.task_id;
    this.taskStatus = input.task_status;
    this.taskResult = input.task_result;

    return this;
  }
}