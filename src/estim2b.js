'use strict';

module.exports = class Estim2B {
    static get CHANNEL_A() { return 'A'; }
    static get CHANNEL_B() { return 'B'; }
    static get CHANNELS() { return [Estim2B.CHANNEL_A, Estim2B.CHANNEL_B]; }

    static get PULSE_FREQUENCY() { return 'C'; }
    static get PULSE_PWM() { return 'D'; }

    static get POWER_HIGH() { return 'H'; }
    static get POWER_LOW() { return 'L'; }
    static get POWERS() { return [Estim2B.POWER_LOW, Estim2B.POWER_HIGH]; }

    // See https://store.e-stim.co.uk/downloads/manuals/2B.pdf (p. 23)
    static get MODE_PULSE() { return 0 }
    static get MODE_ALTERNATING() { return 1 }
    static get MODE_CONTINOUS() { return 2 }
    static get MODE_A_PATTERN() { return 3 }
    static get MODE_B_PATTERN() { return 4 }
    static get MODE_ASYMETRIC_POWER_RAMP() { return 5 }
    static get MODE_SYMETRIC_POWER_RAMP() { return 6 }
    static get MODE_FREQUENCY_RAMP() { return 7 }
    static get MODE_ALTERNATIVE_FREQUENCE_RAMP() { return 8 }
    static get MODE_SAW_WAVE() { return 9 }
    static get MODE_SINE_WAVE() { return 10 }
    static get MODE_RANDOM() { return 11 }
    static get MODE_STEP() { return 12 }
    static get MODE_JUMP() { return 13 }
    static get MODES() { return   [
        this.MODE_PULSE,
        this.MODE_ALTERNATING,
        this.MODE_CONTINOUS,
        this.MODE_A_PATTERN,
        this.MODE_B_PATTERN ,
        this.MODE_ASYMETRIC_POWER_RAMP,
        this.MODE_SYMETRIC_POWER_RAMP,
        this.MODE_FREQUENCY_RAMP,
        this.MODE_ALTERNATIVE_FREQUENCE_RAMP,
        this.MODE_SAW_WAVE,
        this.MODE_SINE_WAVE,
        this.MODE_RANDOM,
        this.MODE_STEP,
        this.MODE_JUMP,
    ] }

    constructor(port, parser) {
        this.port = port;
        this.parser = parser;
        this.status = null;

        this.port.pipe(this.parser);

        this.parser.on('data', line => {
            this.status = this.constructor.parseResponse(line);
        });
    }

    send(command) {
        this.port.write(command + "\r");
    }

    static parseResponse(response) {
        const parts = response.split(':');

        return {
            batteryLevel: parseInt(parts[0]),
            channelALevel: parseInt(parts[1])/2,
            channelBLevel: parseInt(parts[2])/2,
            pulseFrequency: parseInt(parts[3])/2,
            pulsePwm: parseInt(parts[4])/2,
            currentMode: parseInt(parts[5]),
            powerMode: parts[6],
            channelsJoined: parseInt(parts[7]) === 1,
            firmwareVersion: parts[8]
        };
    }

    /**
     * Returns the status the current status
     * @returns object
     */
    getStatus() {
        this.send('');

        return this.status;
    }

    /**
     * Sets the mode (MODE_*)
     * @param mode
     */
    setMode(mode) {
        if (-1 === this.constructor.MODES.indexOf(mode)) {
            throw new Error('Invalid mode: ' + mode);
        }

        this.send('M' + mode);
    }

    /**
     * Sets the power mode and sets both channel to 0%
     * @param powerMode
     */
    setPowerMode(powerMode) {
        if (-1 === this.constructor.POWERS.indexOf(powerMode)) {
            throw new Error('Invalid power mode: ' + powerMode);
        }

        this.send(powerMode);
    }

    /**
     * Sets the power for a channel (CHANNEL_*) to the given percentage (0-99)
     * @param channel
     * @param percentage
     */
    setPower(channel, percentage) {
        if (-1 === this.constructor.CHANNELS.indexOf(channel)){
            throw new Error('Illegal output channel: ' + channel);
        } else if (percentage < 0) {
            throw new Error('Percentage must be greater or equals 0');
        } else if (percentage > 99) {
            throw new Error('Percentage must be less or equals 99');
        }

        this.send(channel + parseInt(percentage));
    }

    setPulsePwm(setting) {
        if (setting < 2) {
            throw new Error('Pulse PWM must be greater or equals 2');
        } else if (setting > 99) {
            throw new Error('Pulse PWM must be less or equals 99');
        }

        this.send(this.constructor.PULSE_PWM + parseInt(setting));
    }

    setPulseFrequency(setting) {
        if (setting < 2) {
            throw new Error('Pulse frequency must be greater or equals 2');
        } else if (setting > 99) {
            throw new Error('Pulse frequency must be less or equals 99');
        }

        this.send(this.constructor.PULSE_FREQUENCY + parseInt(setting));
    }

    /**
     * Set channel A/B to 0%
     */
    setPowerZero() {
        this.send('K');
    }

    joinChannels() {
        this.send('J');
    }

    unlinkChannels() {
        this.send('U');
    }

    /**
     * Set all channels to defaults (A/B: 0%, C/D: 50, Mode: Pulse)
     */
    reset() {
        this.send('E');
    }
};
