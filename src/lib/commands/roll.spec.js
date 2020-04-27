const roll = require("./roll.js");
const util = require("../util.js");
const error = require("../error.js");

describe("roll", function () {
  const done = jasmine.createSpy("done");
  describe("run", function () {
    describe("roll", function () {
      it("should use n by default when rolling a die", function () {
        const n = 6;
        const rolled = 1;
        spyOn(Math, "random").and.returnValue(0);
        const res = roll.run(
          util.getCommandByName("roll"),
          [],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith(`You rolled ${rolled} on a d${n}`);
      });
      it("should use the passed in number when rolling a die", function () {
        const n = 20;
        const rolled = 11;
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          [n],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith(`You rolled ${rolled} on a d${n}`);
      });
      it("should use the passed in number and count when rolling a die", function () {
        const n = 20;
        const rolled = [11, 11, 11, 11, 11];
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          [n, 5],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith(`You rolled ${rolled} on a d${n}`);
      });
    });
    describe("list", function () {
      it("should throw an error if list has less than two elements", function () {
        expect(function () {
          roll.run(
            util.getCommandByName("roll"),
            ["list", "A"],
            undefined,
            done
          );
        }).toThrowError(
          error.UserError,
          "Must have at least two items to select from. Try '!roll list A B C'"
        );
      });
      it("should select an item from the given list", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["list", "A", "B", "C"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("B?");
      });
    });
    describe("team", function () {
      it("should roll a team", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["team"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("Khemri Tomb Kings?");
      });
    });
    describe("skill", function () {
      it("should throw an error for using an unknown skill category", function () {
        expect(function () {
          roll.run(
            util.getCommandByName("roll"),
            ["skill", "Z"],
            undefined,
            done
          );
        }).toThrowError(
          error.UserError,
          "Unknown skill category [Z], try G,A,P,S,M"
        );
      });
      it("should use GAPS by default", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["skill"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("Side Step? (using G,A,P,S)");
      });
      it("should use G", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["skill", "G"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("Pass Block? (using G)");
      });
      it("should use A", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["skill", "A"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("Leap? (using A)");
      });
      it("should use S", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["skill", "S"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("Multiple Block? (using S)");
      });
      it("should use P", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["skill", "P"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("Leader? (using P)");
      });
      it("should use M", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["skill", "M"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("Horns? (using M)");
      });
      it("should handle lower case categories", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["skill", "m"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("Horns? (using M)");
      });
      it("should handle combined skill categories", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["skill", "GM"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("Tackle? (using G,M)");
      });
      it("should handle seperated skill categories", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(
          util.getCommandByName("roll"),
          ["skill", "G", "M"],
          undefined,
          done
        );
        expect(done).toHaveBeenCalledWith("Tackle? (using G,M)");
      });
    });
  });

  describe("die", function () {
    it("should return a 1 when low roll", function () {
      spyOn(Math, "random").and.returnValue(0);
      const res = roll.die(100);
      expect(res).toEqual(1);
    });
    it("should return a 1 when high roll", function () {
      const value = 100;
      spyOn(Math, "random").and.returnValue(0.9999999999);
      const res = roll.die(value);
      expect(res).toEqual(value);
    });
    it("should throw when given a negative number", function () {
      expect(function () {
        roll.die(-100);
      }).toThrowError(error.UserError, "You can't roll a negative number!");
    });
  });
});
