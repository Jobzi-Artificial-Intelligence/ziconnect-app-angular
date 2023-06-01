import { AnalysisTaskException } from "./analysis-task-exception.model";

describe('Model: AnalysisTaskException', () => {

  it('should initialize all properties correctly', () => {
    const analysisTaskException = new AnalysisTaskException();

    expect(analysisTaskException.exceptionType).toEqual('');
    expect(analysisTaskException.exceptionMessage).toEqual(null);
  });

  describe('#deserialize', () => {
    it('should exists', () => {
      const analysisTaskException = new AnalysisTaskException();

      expect(analysisTaskException.deserialize).toBeTruthy();
      expect(analysisTaskException.deserialize).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const exceptionFromServer = { exc_type: 'Exception', exc_message: 'Exception message' };
      const analysisTaskException = new AnalysisTaskException().deserialize(exceptionFromServer);

      expect(analysisTaskException.exceptionType).toEqual(exceptionFromServer.exc_type);
      expect(analysisTaskException.exceptionMessage).toEqual(exceptionFromServer.exc_message);
    });
  });
});