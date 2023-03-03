import * as moment from "moment";
import { AnalysisTaskStatus } from "src/app/_helpers/enums/analysis-task-status";
import { AnalysisTask } from "./analysis-task.model";

describe('Model: AnalysisTask', () => {

  it('should initialize all properties correctly', () => {
    const analysisTask = new AnalysisTask();

    expect(analysisTask.id).toEqual('');
    expect(analysisTask.status).toEqual(AnalysisTaskStatus.Pending);
    expect(analysisTask.result).toEqual(null);
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
        },
        task_received: moment().format(),
        task_started: moment().format(),
        task_failure: null,
        task_success: null
      };
      const analysisTask = new AnalysisTask();
      analysisTask.deserialize(analysisTaskFromServer);

      expect(analysisTask.id).toEqual(analysisTaskFromServer.task_id);
      expect(analysisTask.status).toEqual(AnalysisTaskStatus.Pending);
      expect(analysisTask.result).toEqual(analysisTaskFromServer.task_result);
      expect(analysisTask.receivedAt).toEqual(moment(analysisTaskFromServer.task_received));
      expect(analysisTask.startedAt).toEqual(moment(analysisTaskFromServer.task_started));
    });
  });

  describe('#fromLocalStorage', () => {
    it('should exists', () => {
      const analysisTask = new AnalysisTask();

      expect(analysisTask.fromLocalStorage).toBeTruthy();
      expect(analysisTask.fromLocalStorage).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const analysisTaskFromStorage = {
        id: 'abc-123',
        status: 'PENDING',
        result: {
          message: 'success'
        },
        receivedAt: moment().format(),
        startedAt: moment().format(),
        failureAt: null,
        successAt: null
      };
      const analysisTask = new AnalysisTask();
      analysisTask.fromLocalStorage(analysisTaskFromStorage);

      expect(analysisTask.id).toEqual(analysisTaskFromStorage.id);
      expect(analysisTask.status).toEqual(AnalysisTaskStatus.Pending);
      expect(analysisTask.result).toEqual(analysisTaskFromStorage.result);
      expect(analysisTask.receivedAt).toEqual(moment(analysisTaskFromStorage.receivedAt));
      expect(analysisTask.startedAt).toEqual(moment(analysisTaskFromStorage.startedAt));
    });
  });

  describe('#toLocalStorageString', () => {
    it('should exists', () => {
      const analysisTask = new AnalysisTask();

      expect(analysisTask.toLocalStorageString).toBeTruthy();
      expect(analysisTask.toLocalStorageString).toEqual(jasmine.any(Function));
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
      const result = analysisTask.toLocalStorageString();

      expect(result).toEqual(jasmine.any(String));
    });
  });

  it('get date fields string should works', () => {
    let analysisTask = new AnalysisTask();

    // FAILURE
    analysisTask.failureAt = null;
    expect(analysisTask.failureAtString).toEqual('');
    analysisTask.failureAt = moment();
    expect(analysisTask.failureAtString).toEqual(analysisTask.failureAt.format('L LTS'));

    // RECEIVED
    analysisTask.receivedAt = null;
    expect(analysisTask.receivedAtString).toEqual('');
    analysisTask.receivedAt = moment();
    expect(analysisTask.receivedAtString).toEqual(analysisTask.receivedAt.format('L LTS'));

    // STARTED
    analysisTask.startedAt = null;
    expect(analysisTask.startedAtString).toEqual('');
    analysisTask.startedAt = moment();
    expect(analysisTask.startedAtString).toEqual(analysisTask.startedAt.format('L LTS'));

    // STATUS
    analysisTask.statusCheckedAt = null;
    expect(analysisTask.statusCheckedAtString).toEqual('');
    analysisTask.statusCheckedAt = moment();
    expect(analysisTask.statusCheckedAtString).toEqual(analysisTask.statusCheckedAt.format('L LTS'));

    // SUCCESS
    analysisTask.successAt = null;
    expect(analysisTask.successAtString).toEqual('');
    analysisTask.successAt = moment();
    expect(analysisTask.successAtString).toEqual(analysisTask.successAt.format('L LTS'));
  });
});