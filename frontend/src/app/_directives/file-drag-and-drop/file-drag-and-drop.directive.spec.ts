import { FileDragAndDropDirective } from './file-drag-and-drop.directive';

describe('FileDragAndDropDirective', () => {
  let directive: FileDragAndDropDirective;

  beforeEach(async () => {
    directive = new FileDragAndDropDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('#onDragOver', () => {
    it('should exists', () => {
      expect(directive.onDragOver).toBeTruthy();
      expect(directive.onDragOver).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const event = {
        preventDefault: jasmine.createSpy(),
        stopPropagation: jasmine.createSpy()
      };

      directive.onDragOver(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(directive.fileOver).toEqual(true);
    });
  });

  describe('#onDragLeave', () => {
    it('should exists', () => {
      expect(directive.onDragLeave).toBeTruthy();
      expect(directive.onDragLeave).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      const event = {
        preventDefault: jasmine.createSpy(),
        stopPropagation: jasmine.createSpy()
      };

      directive.onDragLeave(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(directive.fileOver).toEqual(false);
    });
  });

  describe('#ondrop', () => {
    it('should exists', () => {
      expect(directive.ondrop).toBeTruthy();
      expect(directive.ondrop).toEqual(jasmine.any(Function));
    });

    it('should works', () => {
      spyOn(directive.fileDropped, 'emit');

      const event = {
        preventDefault: jasmine.createSpy(),
        stopPropagation: jasmine.createSpy(),
        dataTransfer: {
          files: [{
            name: 'sample.txt'
          }]
        }
      };

      directive.ondrop(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(directive.fileOver).toEqual(false);
      expect(directive.fileDropped.emit).toHaveBeenCalledWith(event.dataTransfer.files);
    });
  });
});
