class LiveController < WebsocketRails::BaseController

	def initialize_session
		controller_store[:map] = []
	end

    def client_connected
		WebsocketRails[:stream].trigger(:data, {:event => :client_connected}.to_json)
    end

	def client_disconnected
		WebsocketRails[:stream].trigger(:data, {:event => :client_disconnected}.to_json)
    end

	def update_map
		controller_store[:map] << message
		controller_store[:map].uniq!
		WebsocketRails[:stream].trigger(:map_update, controller_store[:map].to_json)
	end

	def stream

	end
end
