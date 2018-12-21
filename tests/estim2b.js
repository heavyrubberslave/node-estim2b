import test from 'ava';
import sinon from 'sinon'
import Serialport from 'serialport';
import Readline from '@serialport/parser-readline';
import Estim2B from '../src/estim2b.js';

test('constructor returns object', t => {
    const port = sinon.createStubInstance(Serialport);
    port.pipe.callsFake(() => {});
    const readline = sinon.createStubInstance(Readline);
    readline.on.callsFake((arg) => {
        t.is(arg, 'data');
    });
    const instance = new Estim2B(port, readline);

    t.true(instance instanceof Estim2B);
});

test('send command', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    instance.send('FOO');

    t.is(port.write.getCall(0).args[0], "FOO\r");
});

test('getStatus returns status object', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    port.read.callsFake(() => '100:90:150:100:90:4:L:0:2.106');

    const instance = new Estim2B(port, readline);
    const res = instance.getStatus();

    const expectedRes = {
        batteryLevel: 100,
        channelALevel: 45,
        channelBLevel: 75,
        pulseFrequency: 50,
        pulsePwm: 45,
        currentMode: 4,
        powerMode: "L",
        channelsJoined: false,
        firmwareVersion: "2.106"
    };

    instance.status = expectedRes;

    t.deepEqual(res, expectedRes);
});

test('set power of channel A to 10%', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    instance.setPower(Estim2B.CHANNEL_A, 10);

    t.is(port.write.getCall(0).args[0], "A10\r");
});

test('set power of invalid channel', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    const err = t.throws(function () {
        instance.setPower('F', 10)
    });

    t.is(err.message, 'Illegal output channel: F')
});

test('set power of channel A to high', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    const err = t.throws(function () {
        instance.setPower(Estim2B.CHANNEL_A, 101)
    });

    t.is(err.message, 'Percentage must be less or equals 99')
});

test('set power of channel A to low', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    const err = t.throws(function () {
        instance.setPower(Estim2B.CHANNEL_A, -1)
    });

    t.is(err.message, 'Percentage must be greater or equals 0')
});

test('reset channels, frequency and pwm', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    instance.reset();

    t.is(port.write.getCall(0).args[0], "E\r");
});

test('set power of both channels to 0', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    instance.setPowerZero();

    t.is(port.write.getCall(0).args[0], "K\r");
});

test('set power mode to high', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    instance.setPowerMode(Estim2B.POWER_HIGH);

    t.is(port.write.getCall(0).args[0], "H\r");
});

// Pulse frequency
test('set pulse frequency', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    instance.setPulseFrequency(20);

    t.is(port.write.getCall(0).args[0], "C20\r");
});


test('set pulse frequency to low', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    const err = t.throws(function () {
        instance.setPulseFrequency(1)
    });

    t.is(err.message, 'Pulse frequency must be greater or equals 2')
});

test('set pulse frequency to high', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    const err = t.throws(function () {
        instance.setPulseFrequency(100)
    });

    t.is(err.message, 'Pulse frequency must be less or equals 99')
});

// Pulse PWM
test('set pulse PWM', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    instance.setPulsePwm(20);

    t.is(port.write.getCall(0).args[0], "D20\r");
});


test('set pulse PWM to low', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    const err = t.throws(function () {
        instance.setPulsePwm(1)
    });

    t.is(err.message, 'Pulse PWM must be greater or equals 2')
});

test('set pulse PWM to high', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    const err = t.throws(function () {
        instance.setPulsePwm(100)
    });

    t.is(err.message, 'Pulse PWM must be less or equals 99')
});

// Joining
test('join channels', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    instance.joinChannels();

    t.is(port.write.getCall(0).args[0], "J\r");
});

test('unlink channels', t => {
    const port = sinon.createStubInstance(Serialport);
    const readline = sinon.createStubInstance(Readline);
    const instance = new Estim2B(port, readline);

    instance.unlinkChannels();

    t.is(port.write.getCall(0).args[0], "U\r");
});
