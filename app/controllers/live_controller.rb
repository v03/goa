class LiveController < WebsocketRails::BaseController

	def initialize_session
		controller_store[:message_count] = 0
	end

    def client_connected
		WebsocketRails[:stream].trigger(:data, {:event => :client_connected}.to_json)
    end

end
