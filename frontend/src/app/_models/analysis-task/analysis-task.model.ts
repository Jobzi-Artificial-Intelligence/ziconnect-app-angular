import * as moment from "moment";
import { AnalysisTaskStatus } from "src/app/_helpers/enums/analysis-task-status";
import { Deserializable } from "../deserializable.model";


export class AnalysisTask implements Deserializable {
  id: String;
  status: AnalysisTaskStatus;
  result: any;
  receivedAt: any;
  startedAt: any;
  failureAt: any;
  successAt: any;
  statusCheckedAt: any;
  statusCheckCode: number;
  statusCheckMessage: string;

  constructor() {
    this.id = '';
    this.status = AnalysisTaskStatus.Pending;
    this.result = null;
    this.statusCheckCode = 0;
    this.statusCheckMessage = '';

    this.statusCheckedAt = moment();
  }

  deserialize(input: any): this {
    this.id = input.task_id;
    this.status = input.task_status;
    this.result = input.task_result;

    this.statusCheckedAt = moment();

    const inputDateFielsMap = {
      failureAt: 'task_failure',
      receivedAt: 'task_received',
      startedAt: 'task_started',
      successAt: 'task_success'
    } as any;

    // SET DATE FIEDS VALUES
    Object.keys(inputDateFielsMap).forEach((key) => {
      const inputDateField = input[inputDateFielsMap[key]];
      if (inputDateField) {
        (this as any)[key] = moment(inputDateField);
      }
    });

    return this;
  }

  fromLocalStorage(input: any): this {
    this.id = input.id;
    this.status = input.status;
    this.result = input.result;
    this.statusCheckCode = input.statusCheckCode;
    this.statusCheckMessage = input.statusCheckMessage;

    const inputDateFielsMap = [
      'failureAt',
      'receivedAt',
      'startedAt',
      'statusCheckedAt',
      'successAt',
    ];

    inputDateFielsMap.forEach((dateField) => {
      const dateValue = input[dateField];
      if (dateValue) {
        const momentDate = moment(dateValue);
        if (momentDate.isValid()) {
          (this as any)[dateField] = momentDate;
        }
      }
    });

    return this;
  }

  toLocalStorageString() {
    let obj = Object.assign({}, this);

    delete obj.result;

    return JSON.stringify(obj);
  }

  get failureAtString() {
    return this.failureAt ? this.failureAt.format('L LTS') : '';
  }

  get receivedAtString() {
    return this.receivedAt ? this.receivedAt.format('L LTS') : '';
  }

  get startedAtString() {
    return this.startedAt ? this.startedAt.format('L LTS') : '';
  }

  get statusCheckedAtString() {
    return this.statusCheckedAt ? this.statusCheckedAt.format('L LTS') : '';
  }

  get successAtString() {
    return this.successAt ? this.successAt.format('L LTS') : '';
  }
}