function Estim2B(port) {
    this.port = port;
}

Estim2B.CHANNEL_A = 'A';
Estim2B.CHANNEL_B = 'B';
Estim2B.CHANNEL_PULSE_FREQUENCY = 'C';
Estim2B.CHANNEL_PULSE_PWM = 'D'; // Pulse-width modulation
Estim2B.CHANNELS = [Estim2B.CHANNEL_A, Estim2B.CHANNEL_B];

Estim2B.POWER_HIGH = 'H';
Estim2B.POWER_LOW = 'L';
Estim2B.POWERS = [Estim2B.POWER_LOW, Estim2B.POWER_HIGH];

Estim2B.MODE_PULSE = 0;
Estim2B.MODE_ALTERNATING = 1;
Estim2B.MODE_CONTINOUS = 2;
Estim2B.MODE_A_PATTERN = 3;
Estim2B.MODE_B_PATTERN = 4;
Estim2B.MODE_ASYMETRIC_POWER_RAMP = 5;
Estim2B.MODE_SYMETRIC_POWER_RAMP = 6;
Estim2B.MODE_FREQUENCY_RAMP = 7;
Estim2B.MODE_ALTERNATIVE_FREQUENCE_RAMP = 8;
Estim2B.MODE_SAW_WAVE = 9;
Estim2B.MODE_SINE_WAVE = 10;
Estim2B.MODE_RANDOM = 11;
Estim2B.MODE_STEP = 12;
Estim2B.MODE_JUMP = 13;
Estim2B.MODES = [
    Estim2B.MODE_PULSE,
    Estim2B.MODE_ALTERNATING,
    Estim2B.MODE_CONTINOUS,
    Estim2B.MODE_A_PATTERN,
    Estim2B.MODE_B_PATTERN ,
    Estim2B.MODE_ASYMETRIC_POWER_RAMP,
    Estim2B.MODE_SYMETRIC_POWER_RAMP,
    Estim2B.MODE_FREQUENCY_RAMP,
    Estim2B.MODE_ALTERNATIVE_FREQUENCE_RAMP,
    Estim2B.MODE_SAW_WAVE,
    Estim2B.MODE_SINE_WAVE,
    Estim2B.MODE_RANDOM,
    Estim2B.MODE_STEP,
    Estim2B.MODE_JUMP,
];

Estim2B.prototype.send = function send(command) {
    this.port.write(command + "\r");
    console.log("Write: " + command);
};

Estim2B.prototype.setPowerMode = function setPowerMode(powerMode) {
    if (-1 === Estim2B.POWERS.indexOf(powerMode)) {
        throw new Error('Invalid power mode: ' + powerMode);
    }

    this.send(powerMode);
};

Estim2B.prototype.setPower = function setPower(channel, percentage) {
    if (-1 === Estim2B.CHANNELS.indexOf(channel)){
        throw new Error('Illegal output channel: ' + channel);
    } else if (percentage < 0.0) {
        throw new Error('Percentage must be greater or equals 0.0');
    } else if (percentage > 100.0) {
        throw new Error('Percentage must be lower or equals 100.0');
    }

    this.send(channel + percentage);
};

Estim2B.prototype.setPulseFrequency = function setPulseFrequency(setting) {
    if (setting < 2) {
        throw new Error('Pulse frequency must be greater or equals 2');
    } else if (setting > 100) {
        throw new Error('Pulse frequency must be lower or equals 100');
    }

    this.send(Estim2B.CHANNEL_PULSE_FREQUENCY + setting);
};

Estim2B.prototype.setPulsePwm = function setPulsePwm(setting) {
    if (setting < 2) {
        throw new Error('Pulse PWM must be greater or equals 2');
    } else if (setting > 100) {
        throw new Error('Pulse PWM must be lower or equals 100');
    }

    this.send(Estim2B.CHANNEL_PULSE_PWM + setting);
};

Estim2B.prototype.setMode = function setMode(mode) {
    if (-1 === Estim2B.MODES.indexOf(mode)) {
        throw new Error('Invalid mode: ' + mode);
    }

    this.send('M' + mode);
};

/**
 * Set all Channels to defaults (A/B: 0%, C/D: 50, Mode: Pulse)
 */
Estim2B.prototype.reset = function reset() {
    this.send('E');
};

module.exports = Estim2B;
