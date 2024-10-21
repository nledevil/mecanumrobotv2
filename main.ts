/**
 * Keyestudio Mecanum Micro:bit V2
 * Re-written by Ryan Schultz
 */
enum MotorLoc {
    Front_left = 0,
    Back_left = 1,
    Front_right = 2,
    Back_right = 3,
}
enum MotorDir {
    Forward = 0,
    Reverse = 1
};
enum MotorState {
    stop = 0,
    brake = 1
}
enum LEDLoc {
    Left = 0x09,
    Right = 0x0a
}
enum LEDState {
    ON = 4095,
    OFF = 0
}
//% color="#AA278D" weight=100
//% groups="['Motor', 'LED', 'Servo', 'Sensors']"
namespace mecanumRobotV2 {
    export enum Servos {
        D14 = 14,
        D15 = 15
    };
    const STC15_ADDRESS = 0x30;   //device address

    function i2cWrite(STC15_ADDRESS: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(STC15_ADDRESS, buf)

    }

    /****** MOTOR GROUP *******/

    /**
     * set speed of motor
     */
    //% block="Run $M motor $D at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function ControlMotor(M: MotorLoc, D: MotorDir, speed: number) {
        let speed_value = Math.map(speed, 0, 100, 0, 255);
        if (M == 2 && D == 1) {
            i2cWrite(0x30, 0x01, speed_value); //M1A
            i2cWrite(0x30, 0x02, 0); //M1B
        }
        if (M == 2 && D == 0) {
            i2cWrite(0x30, 0x01, 0); //M1A
            i2cWrite(0x30, 0x02, speed_value); //M1B
        }
        if (M == 0 && D == 0) {
            i2cWrite(0x30, 0x03, 0); //M2A
            i2cWrite(0x30, 0x04, speed_value); //M2B
        }
        if (M == 0 && D == 1) {
            i2cWrite(0x30, 0x03, speed_value); //M2A
            i2cWrite(0x30, 0x04, 0); //M2B
        }
        if (M == 3 && D == 1) {
            i2cWrite(0x30, 0x05, speed_value); //M3A
            i2cWrite(0x30, 0x06, 0); //M3B
        }
        if (M == 3 && D == 0) {
            i2cWrite(0x30, 0x05, 0); //M3A
            i2cWrite(0x30, 0x06, speed_value); //M3B
        }
        if (M == 1 && D == 0) {
            i2cWrite(0x30, 0x07, 0); //M4A
            i2cWrite(0x30, 0x08, speed_value); //M4B
        }
        if (M == 1 && D == 1) {
            i2cWrite(0x30, 0x07, speed_value); //M4A
            i2cWrite(0x30, 0x08, 0); //M4B
        }
    }

    //% block="Drive Forward at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function DriveForward(speed: number) {
        ControlMotor(0, 0, speed);
        ControlMotor(1, 0, speed);
        ControlMotor(2, 0, speed);
        ControlMotor(3, 0, speed);
    };

    //% block="Drive Back at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function DriveBack(speed: number) {
        ControlMotor(0, 1, speed);
        ControlMotor(1, 1, speed);
        ControlMotor(2, 1, speed);
        ControlMotor(3, 1, speed);
    };

    //% block="Strafe Left at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function StrafeLeft(speed: number) {
        ControlMotor(0, 1, speed);
        ControlMotor(1, 0, speed);
        ControlMotor(2, 0, speed);
        ControlMotor(3, 1, speed);
    };

    //% block="Strafe Right at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function StrafeRight(speed: number) {
        ControlMotor(0, 0, speed);
        ControlMotor(1, 1, speed);
        ControlMotor(2, 1, speed);
        ControlMotor(3, 0, speed);
    };

    //% block="Rotate Right at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function RotateRight(speed: number) {
        ControlMotor(0, 0, speed);
        ControlMotor(1, 0, speed);
        ControlMotor(2, 1, speed);
        ControlMotor(3, 1, speed);
    };

    //% block="Rotate Left at speed: $speed"
    //% speed.min=0 speed.max=100
    //% group="Motor"
    export function RotateLeft(speed: number) {
        ControlMotor(0, 1, speed);
        ControlMotor(1, 1, speed);
        ControlMotor(2, 0, speed);
        ControlMotor(3, 0, speed);
    };

    //% block="Stop Motors"
    //% group="Motor"
    export function StopMotor() {
        //stop
        i2cWrite(0x30, 0x01, 0); //M1A
        i2cWrite(0x30, 0x02, 0); //M1B
        i2cWrite(0x30, 0x03, 0); //M1A
        i2cWrite(0x30, 0x04, 0); //M1B
        i2cWrite(0x30, 0x05, 0); //M1A
        i2cWrite(0x30, 0x06, 0); //M1B
        i2cWrite(0x30, 0x07, 0); //M1A
        i2cWrite(0x30, 0x08, 0); //M1B
    }

    /****** LED GROUP *******/

    /**
     * turn off all rgb-led
     */
    //% block="Turn $LedC LED $LedS"
    //% group="LED" weight=76
    export function setLed(LedC: LEDLoc, LedS: LEDState) {
        i2cWrite(0x30, LedC, LedS);
    }

    /****** SERVO GROUP *******/

    //% block="Set SERVO to angle %angle"
    //% group="Servo" weight=70
    //% angle.min=-90 angle.max.max=90
    export function setServo(angle: number): void {
        pins.servoWritePin(AnalogPin.P14, angle)
    }

    /****** SENSORS GROUP *******/

    /**
     * Ultrasonic sensor
     */
    let lastTime = 0;
    //% block="Ultrasonic Value"
    //% group="Sensors" weight=68
    export function ultra(): number {
        //send trig pulse
        pins.setPull(DigitalPin.P15, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P15, 0)
        control.waitMicros(2);
        pins.digitalWritePin(DigitalPin.P15, 1)
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P15, 0)

        // read echo pulse  max distance : 6m(35000us)  
        let t = pins.pulseIn(DigitalPin.P16, PulseValue.High, 35000);
        let ret = t;

        //Eliminate the occasional bad data
        if (ret == 0 && lastTime != 0) {
            ret = lastTime;
        }
        lastTime = t;

        return Math.round(ret / 58);
    }
}