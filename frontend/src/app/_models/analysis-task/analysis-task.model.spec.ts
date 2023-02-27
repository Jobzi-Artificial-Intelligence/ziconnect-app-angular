import { AnalysisTaskStatus } from "src/app/_helpers/enums/analysis-task-status";
import { AnalysisTask } from "./analysis-task.model";

describe('Model: AnalysisTask', () => {

  it('should initialize all properties correctly', () => {
    const analysisTask = new AnalysisTask();

    expect(analysisTask.taskId).toEqual('');
    expect(analysisTask.taskStatus).toEqual(AnalysisTaskStatus.Pending);
    expect(analysisTask.taskResult).toEqual(null);
  });

  describe('#deserialize', () => {
    it('should exists', () => {
      const analysisTask = new AnalysisTask();

      expect(analysisTask.deserialize).toBeTruthy();
      expect(analysisTask.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const analysisTaskFromServer = {
        task_id: 'abc-123',
        task_status: 'PENDING',
        task_result: {
          message: 'success'
        }
      };
      const analysisTask = new AnalysisTask();
      analysisTask.deserialize(analysisTaskFromServer);

      expect(analysisTask.taskId).toEqual(analysisTaskFromServer.task_id);
      expect(analysisTask.taskStatus).toEqual(AnalysisTaskStatus.Pending);
      expect(analysisTask.taskResult).toEqual(analysisTaskFromServer.task_result);
    });
  });
});