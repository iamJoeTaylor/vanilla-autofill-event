describe('check other inputs when one input fires a blur event', function() {
  var container, clock;

  beforeEach(function() {
    container = testutils.$('<div></div>');
    document.body.appendChild(container[0]);
    container.on('change', function(event) {
      event.target.changeEventCount = event.target.changeEventCount || 0;
      event.target.changeEventCount++;
    });
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
    container.remove()
  });

  it('should check elements in the same form and not in other forms after 20ms when an element is blurred', function() {
    container.append('<form><input type="text" id="id1"><input type="text" id="id2"></form><form><input type="text" id="id3"></form>');
    var inputs = container.get(0).querySelectorAll('input');
    var spy = sinon.spy(window, 'checkAndTriggerAutoFillEvent');

    testutils.triggerBlurEvent(inputs[0]);
    expect(spy).to.not.have.been.called;

    clock.tick(20);

    expect(spy).to.have.been.called;
    expect(spy.lastCall.args[0].length).to.eq(2);
    expect(spy.lastCall.args[0][0]).to.eq(inputs[0]);
    expect(spy.lastCall.args[0][1]).to.eq(inputs[1]);
  });

  describe('checkAndTriggerAutoFillEvent', function() {
    var input;

    beforeEach(function() {
      container.append('<input type="text">');
      inputs = container.get(0).children;
      inputEl = inputs[0];
    });


    describe('changes by user via change event', function() {

      it('should not fire an extra change event when there was a change event for the element', function() {
        // Don't use .val as we intercept this!
        inputEl.value = 'someValue';

        testutils.triggerChangeEvent(inputEl);
        expect(inputEl.changeEventCount).to.eq(1);

        inputEl.checkAndTriggerAutoFillEvent();

        expect(inputEl.changeEventCount).to.eq(1);
      });

      it('should not fire an extra change event when the value did not change', function() {
        // Don't use .val as we intercept this!
        inputEl.value = 'someValue';

        testutils.triggerChangeEvent(inputEl);
        inputEl.checkAndTriggerAutoFillEvent();

        testutils.triggerChangeEvent(inputEl);
        inputEl.checkAndTriggerAutoFillEvent();

        expect(inputEl.changeEventCount).to.eq(2);
      });

    });

    describe('changes by js code via $.fn.val', function() {

      it('should not fire a change event when js code changes the element', function() {
        $(input).val('someValue');
        expect(inputEl.changeEventCount).to.be.undefined;

        inputEl.checkAndTriggerAutoFillEvent();

        expect(inputEl.changeEventCount).to.be.undefined;
      });

      it('should not fire an extra change event when the value did not change', function() {
        $(input).val('someValue');
        inputEl.checkAndTriggerAutoFillEvent();

        $(input).val('someValue');
        inputEl.checkAndTriggerAutoFillEvent();

        expect(inputEl.changeEventCount).to.be.undefined;
      });

    });

    describe('misc', function() {
      it('should not fire for untouched inputs with empty value', function() {
        inputEl.checkAndTriggerAutoFillEvent();
        expect(inputEl.changeEventCount).to.be.undefined;
      });

      it('should not fire if inputs are added with predefined value', function() {
        container.append('<input type="text" value="test">');
        var newInput = container.children().eq(1)[0];
        newInput.checkAndTriggerAutoFillEvent();
        expect(newInput.changeEventCount).to.be.undefined;
      });

    });

    it('should fire a change event if the value was changed by another way', function() {
      // Don't use .val as we intercept this!
      inputEl.value = 'someValue';

      inputEl.checkAndTriggerAutoFillEvent();

      expect(inputEl.changeEventCount).to.eq(1);
    });

  });

});
