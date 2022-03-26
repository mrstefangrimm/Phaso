// Copyright (c) 2021-2022 Stefan Grimm. All rights reserved.
// Licensed under the GPL. See LICENSE file in the project root for full license information.
//

using Collares;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using Virms.Web.Core;

namespace Virms.Web {

  using MotionSystemsResponse = WebApiCollectionResponse<MotionSystemResponse, MotionSystemData>;

  [ApiController]
  [Route("api/[controller]")]
  public class MotionSystemsController : ControllerBase {

    private readonly ILogger<MotionSystemsController> _logger;
    private readonly ApplicationApi _applicationApi;

    public MotionSystemsController(
      ILogger<MotionSystemsController> logger,
      ApplicationApi applicationApi) {
      _logger = logger;
      _applicationApi = applicationApi;
    }

    // GET: api/motionsystems
    [HttpGet]
    [ProducesResponseType(typeof(MotionSystemsResponse), StatusCodes.Status200OK)]
    public IActionResult GetMotionSystems() {
      _logger.LogDebug("GetMotionSystems");

      var result = _applicationApi.GetPhantoms();
      var phantoms = result.ToList();

      var response = new MotionSystemsResponse();
      foreach (var entity in phantoms) {
        var motionsystemResponse = new MotionSystemResponse();
        response.Data.Add(motionsystemResponse);
        motionsystemResponse.Id = entity.Id;
        motionsystemResponse.Data.CopyFrom(entity.Data);
      }

      return Ok(response);
    }

    // GET: api/motionsystems/2
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(MotionSystemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(StatusCodeResult), StatusCodes.Status404NotFound)]
    public IActionResult GetMotionSystem(long id) {
      _logger.LogDebug($"GetMotionSystem id:{id}");

      var entity = _applicationApi.GetMotionSystem(id);
      if (entity == null) { return NotFound(); }

      var response = new MotionSystemResponse();
      response.Id = entity.Id;
      response.Data.CopyFrom(entity.Data);
      foreach(var axis in entity.Data.Axes) { response.Data.Axes.Add(axis);  }

      foreach (var pattern in entity.MotionPatterns) {
        var patternResponse = new MotionPatternResponse();
        response.MotionPatterns.Data.Add(patternResponse);
        patternResponse.Id = pattern.Id;
        patternResponse.Data.CopyFrom(pattern.Data);
      }

      return Ok(response);
    }

    // PATCH: api/motionsystems/2
    [HttpPatch("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status304NotModified)]
    public IActionResult PatchMotionSystem(long id, MotionSystemData data) {
      _logger.LogDebug($"PatchMotionSystem id:{id}");

      var result = _applicationApi.PatchMotionSystem(id, data);

      switch (result) {
        default: return Ok();
        case AppSericeResult.NotFound: return NotFound();
        case AppSericeResult.NotChanged: return StatusCode(StatusCodes.Status304NotModified);
      };
    }

    // PATCH: api/motionsystems/2/motionstep
    [HttpPatch("{id}/motionstep")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status304NotModified)]
    public IActionResult PatchMotionSystem(long id, ServoPositionData[] data) {
      _logger.LogDebug($"PatchMotionSystem id:{id}");

      var result = _applicationApi.PatchMotionSystem(id, data);

      switch (result) {
        default: return Ok();
        case AppSericeResult.NotFound: return NotFound();
        case AppSericeResult.NotChanged: return StatusCode(StatusCodes.Status304NotModified);
      };
    }

    // PATCH: api/motionsystems/2/motionpatterns/22
    [HttpPatch("{id}/motionpatterns/{pid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status304NotModified)]
    public IActionResult PatchMotionPattern(long id, long pid, MotionPatternData data) {
      _logger.LogDebug($"PatchMotionSystem id:{id}, pid:{pid}");

      var result = _applicationApi.PatchMotionSystemMotionPattern(id, pid, data);

      switch (result) {
        default: return Ok();
        case AppSericeResult.NotFound: return NotFound();
        case AppSericeResult.NotChanged: return StatusCode(StatusCodes.Status304NotModified);
      };
    }

  }
}
